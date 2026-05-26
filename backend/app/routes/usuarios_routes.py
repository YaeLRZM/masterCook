"""
Endpoints para que el ADMIN de una empresa gestione a su personal.

Reglas duras:
  - Todo se aisla por empresa_id del token (multi-tenant).
  - El ADMIN puede crear / actualizar / desactivar usuarios SOLO de su empresa.
  - El ADMIN puede asignar y quitar roles, EXCEPTO los nombres reservados
    (`ADMIN`, `SUPER_ADMIN`). Esos solo los toca el SUPER_ADMIN.
  - El ADMIN puede crear roles "custom" en su empresa, con la misma restriccion
    de nombres reservados.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.core.constants import ROLES_RESERVADOS
from app.core.security import hashear_password
from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_empresa_actual_id,
    obtener_objeto_del_tenant,
    requiere_roles,
)

from app.models.persona import Persona
from app.models.rol import Rol
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol

from app.schemas.rol_schema import RolCrear, RolSalida
from app.schemas.usuario_schema import (
    UsuarioActualizar,
    UsuarioConRolesSalida,
    UsuarioSalida,
    UsuarioStaffCrear,
)
from app.schemas.auditoria_schema import AuditoriaSalida
from app.models.auditoria import Auditoria


router = APIRouter(prefix="/usuarios", tags=["Personal"])

solo_admin = requiere_roles(["ADMIN", "SUPER_ADMIN"])


def _rol_asignable_o_404(db: Session, rol_id: int) -> Rol:
    """
    Devuelve el rol si:
      - existe en el sistema global,
      - no es un nombre reservado (ADMIN / SUPER_ADMIN).
    En cualquier otro caso, lanza HTTP apropiado.
    """
    rol = db.execute(
        select(Rol).where(Rol.id == rol_id)
    ).scalar_one_or_none()
    if rol is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rol no encontrado",
        )
    if rol.nombre in ROLES_RESERVADOS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"El rol '{rol.nombre}' esta reservado y no puede ser asignado por un ADMIN",
        )
    return rol


def _cargar_roles_del_usuario(db: Session, usuario_id: int) -> list[str]:
    return list(db.execute(
        select(Rol.nombre)
        .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
        .where(UsuarioRol.usuario_id == usuario_id)
    ).scalars().all())


def _serializar(db: Session, usuario: Usuario) -> UsuarioConRolesSalida:
    base = UsuarioSalida.model_validate(usuario)
    return UsuarioConRolesSalida(
        **base.model_dump(),
        roles=_cargar_roles_del_usuario(db, usuario.id),
    )


# --- CRUD de personal -----------------------------------------------------

@router.get("/", response_model=List[UsuarioConRolesSalida])
def listar_personal(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    usuarios = db.execute(
        select(Usuario).where(Usuario.empresa_id == empresa_id)
    ).scalars().all()
    return [_serializar(db, u) for u in usuarios]


@router.post(
    "/",
    response_model=UsuarioConRolesSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_personal(
    payload: UsuarioStaffCrear,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    duplicado = db.execute(
        select(Usuario).where(Usuario.email == payload.email)
    ).scalar_one_or_none()
    if duplicado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado",
        )

    # Pre-valida que todos los roles a asignar sean validos.
    roles_a_asignar = [
        _rol_asignable_o_404(db, rol_id)
        for rol_id in payload.roles_ids
    ]

    persona = None
    if any([payload.nombre, payload.apellido_paterno,
            payload.apellido_materno, payload.telefono]):
        persona = Persona(
            nombre=payload.nombre or payload.nombre_login,
            apellido_paterno=payload.apellido_paterno,
            apellido_materno=payload.apellido_materno,
            telefono=payload.telefono,
        )
        db.add(persona)
        db.flush()

    usuario = Usuario(
        empresa_id=empresa_id,                       # inyectado del token
        persona_id=persona.id if persona else None,
        nombre_login=payload.nombre_login,
        email=payload.email,
        password_hash=hashear_password(payload.password),
        estatus="ACTIVO",
        activo=True,
    )
    db.add(usuario)
    db.flush()

    for rol in roles_a_asignar:
        db.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol.id))

    db.commit()
    db.refresh(usuario)
    return _serializar(db, usuario)


@router.get("/{usuario_id}", response_model=UsuarioConRolesSalida)
def obtener_personal(
    usuario_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    usuario = obtener_objeto_del_tenant(db, Usuario, usuario_id, empresa_id)
    return _serializar(db, usuario)


@router.patch("/{usuario_id}", response_model=UsuarioConRolesSalida)
def actualizar_personal(
    usuario_id: int,
    payload: UsuarioActualizar,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    usuario = obtener_objeto_del_tenant(db, Usuario, usuario_id, empresa_id)
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(usuario, campo, valor)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return _serializar(db, usuario)


@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def desactivar_personal(
    usuario_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    """Soft-delete: marca al usuario como inactivo (no se borra fisicamente)."""
    usuario = obtener_objeto_del_tenant(db, Usuario, usuario_id, empresa_id)
    usuario.activo = False
    usuario.estatus = "INACTIVO"
    db.add(usuario)
    db.commit()


# --- Asignacion / revocacion de roles -------------------------------------

@router.post("/{usuario_id}/roles/{rol_id}", response_model=UsuarioConRolesSalida)
def asignar_rol(
    usuario_id: int,
    rol_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    usuario = obtener_objeto_del_tenant(db, Usuario, usuario_id, empresa_id)
    rol = _rol_asignable_o_404(db, rol_id)

    existente = db.execute(
        select(UsuarioRol).where(
            UsuarioRol.usuario_id == usuario.id,
            UsuarioRol.rol_id == rol.id,
        )
    ).scalar_one_or_none()
    if existente is None:
        db.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol.id))
        db.commit()

    db.refresh(usuario)
    return _serializar(db, usuario)


@router.delete(
    "/{usuario_id}/roles/{rol_id}",
    response_model=UsuarioConRolesSalida,
)
def quitar_rol(
    usuario_id: int,
    rol_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    usuario = obtener_objeto_del_tenant(db, Usuario, usuario_id, empresa_id)
    rol = _rol_asignable_o_404(db, rol_id)

    asignacion = db.execute(
        select(UsuarioRol).where(
            UsuarioRol.usuario_id == usuario.id,
            UsuarioRol.rol_id == rol.id,
        )
    ).scalar_one_or_none()
    if asignacion is not None:
        db.delete(asignacion)
        db.commit()

    db.refresh(usuario)
    return _serializar(db, usuario)


# --- Catalogo de roles asignables -----------------------------------------

@router.get("/roles/", response_model=List[RolSalida])
def listar_roles_asignables(
    db: Session = Depends(get_db),
    _=Depends(solo_admin),
):
    """Lista los roles globales que el ADMIN puede asignar al personal."""
    return db.execute(
        select(Rol).where(
            Rol.nombre.notin_(ROLES_RESERVADOS),
        )
    ).scalars().all()


@router.post(
    "/roles/",
    response_model=RolSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_rol(
    payload: RolCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    """Crea un rol global en el sistema (solo SUPER_ADMIN)."""
    if payload.nombre.upper() in ROLES_RESERVADOS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"El nombre '{payload.nombre}' esta reservado",
        )
    duplicado = db.execute(
        select(Rol).where(Rol.nombre == payload.nombre)
    ).scalar_one_or_none()
    if duplicado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un rol con ese nombre en el sistema",
        )

    rol = Rol(
        nombre=payload.nombre,
        descripcion=payload.descripcion,
    )
    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol


# --- Auditorías ---------------------------------------------------------------

@router.get("/auditorias/", response_model=List[AuditoriaSalida])
def listar_auditorias(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    _=Depends(solo_admin),
):
    """Lista las auditorías de la empresa actual (últimas 50)."""
    return db.execute(
        select(Auditoria)
        .where(Auditoria.empresa_id == empresa_id)
        .order_by(Auditoria.fecha.desc())
        .limit(50)
    ).scalars().all()
