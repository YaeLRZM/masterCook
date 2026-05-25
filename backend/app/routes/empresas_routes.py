"""
Gestion del catalogo de Empresas (tenants). Solo SUPER_ADMIN.

Incluye `POST /empresas/{id}/admin` para dar de alta al ADMIN/representante
de una empresa en un solo paso (crea Persona + Usuario + asigna rol ADMIN
+ crea Representante).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.core.constants import ROL_ADMIN, ROL_SUPER_ADMIN
from app.core.security import hashear_password
from app.database.database import get_db
from app.dependencies.autenticacion import requiere_roles

from app.models.empresa import Empresa
from app.models.persona import Persona
from app.models.rol import Rol
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol
from app.models.representante import Representante

from app.schemas.empresa_schema import (
    EmpresaCrear,
    EmpresaActualizar,
    EmpresaSalida,
)
from app.schemas.usuario_schema import (
    AdminEmpresaCrear,
    AdministradorListadoSalida,
    UsuarioSalida,
)


router = APIRouter(prefix="/empresas", tags=["Empresas"])


@router.get("/", response_model=List[EmpresaSalida])
def listar_empresas(
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    return db.execute(select(Empresa)).scalars().all()


@router.get(
    "/administradores/",
    response_model=List[AdministradorListadoSalida],
)
def listar_administradores(
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    """
    Lista cross-tenant de los usuarios con rol ADMIN en cualquier empresa,
    excluyendo a los super-admins del sistema.
    """
    stmt = (
        select(Usuario, Empresa.nombre, Persona.telefono)
        .join(Empresa, Empresa.id == Usuario.empresa_id)
        .join(UsuarioRol, UsuarioRol.usuario_id == Usuario.id)
        .join(Rol, Rol.id == UsuarioRol.rol_id)
        .outerjoin(Persona, Persona.id == Usuario.persona_id)
        .where(
            Rol.nombre == ROL_ADMIN,
            Rol.nombre != ROL_SUPER_ADMIN,
        )
    )
    rows = db.execute(stmt).all()
    return [
        AdministradorListadoSalida(
            id=usuario.id,
            nombre=usuario.nombre_login,
            email=usuario.email,
            empresa=empresa_nombre,
            empresa_id=usuario.empresa_id,
            estatus=usuario.estatus,
            activo=usuario.activo,
            telefono=telefono,
        )
        for usuario, empresa_nombre, telefono in rows
    ]


@router.post(
    "/",
    response_model=EmpresaSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_empresa(
    payload: EmpresaCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    duplicado = db.execute(
        select(Empresa).where(Empresa.email == payload.email)
    ).scalar_one_or_none()
    if duplicado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email de empresa ya registrado",
        )
    nueva = Empresa(**payload.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.patch("/{empresa_id}", response_model=EmpresaSalida)
def actualizar_empresa(
    empresa_id: int,
    payload: EmpresaActualizar,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    empresa = db.execute(
        select(Empresa).where(Empresa.id == empresa_id)
    ).scalar_one_or_none()
    if empresa is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada",
        )
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(empresa, campo, valor)

    # Mantiene `activa` sincronizada con el estatus.
    if "estatus" in payload.model_dump(exclude_unset=True):
        empresa.activa = (empresa.estatus or "").upper() == "ACTIVA"

    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.patch("/{empresa_id}/toggle-status", response_model=EmpresaSalida)
def alternar_estatus_empresa(
    empresa_id: int,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    """Activa <-> Suspende la empresa en un solo paso."""
    empresa = db.execute(
        select(Empresa).where(Empresa.id == empresa_id)
    ).scalar_one_or_none()
    if empresa is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada",
        )

    if empresa.activa:
        empresa.activa = False
        empresa.estatus = "SUSPENDIDA"
    else:
        empresa.activa = True
        empresa.estatus = "ACTIVA"

    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.post(
    "/{empresa_id}/admin",
    response_model=UsuarioSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_admin_de_empresa(
    empresa_id: int,
    payload: AdminEmpresaCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    """
    Crea el ADMIN/Representante de una empresa.

    En un solo paso:
      1. Valida que la empresa exista.
      2. Crea (o reusa) el rol ADMIN para esa empresa.
      3. Crea la Persona con datos biograficos.
      4. Crea el Usuario en la empresa y le asigna el rol ADMIN.
      5. Crea el registro Representante.
    """
    empresa = db.execute(
        select(Empresa).where(Empresa.id == empresa_id)
    ).scalar_one_or_none()
    if empresa is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada",
        )

    email_dup = db.execute(
        select(Usuario).where(Usuario.email == payload.email)
    ).scalar_one_or_none()
    if email_dup:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado",
        )

    # 1. Rol ADMIN (obtener el rol global)
    rol_admin = db.execute(
        select(Rol).where(Rol.nombre == ROL_ADMIN)
    ).scalar_one_or_none()
    if rol_admin is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Rol ADMIN no existe en el sistema",
        )

    # 2. Persona
    persona = Persona(
        nombre=payload.nombre,
        apellido_paterno=payload.apellido_paterno,
        apellido_materno=payload.apellido_materno,
        telefono=payload.telefono,
    )
    db.add(persona)
    db.flush()

    # 3. Usuario
    usuario = Usuario(
        empresa_id=empresa.id,
        persona_id=persona.id,
        nombre_login=payload.nombre_login,
        email=payload.email,
        password_hash=hashear_password(payload.password),
        estatus="ACTIVO",
        activo=True,
    )
    db.add(usuario)
    db.flush()

    # 4. Asignacion del rol
    db.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol_admin.id))

    # 5. Representante (uno por empresa garantizado por unique en usuario_id)
    representante = Representante(
        empresa_id=empresa.id,
        usuario_id=usuario.id,
        cargo=payload.cargo,
        es_legal=True,
    )
    db.add(representante)

    db.commit()
    db.refresh(usuario)
    return usuario
