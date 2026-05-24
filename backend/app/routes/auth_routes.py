from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.database import get_db

from app.models.usuario import Usuario
from app.models.rol import Rol
from app.models.usuario_rol import UsuarioRol

from app.schemas.usuario_schema import (
    UsuarioCrear,
    UsuarioLogin,
    UsuarioSalida,
    TokenSalida,
)

from app.core.security import (
    hashear_password,
    verificar_password,
    crear_access_token,
)


router = APIRouter(prefix="/auth", tags=["Autenticacion"])


@router.post("/register", response_model=UsuarioSalida)
def registrar(payload: UsuarioCrear, db: Session = Depends(get_db)):
    duplicado = db.execute(
        select(Usuario).where(Usuario.email == payload.email)
    ).scalar_one_or_none()
    if duplicado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado",
        )

    nuevo = Usuario(
        nombre_login=payload.nombre_login,
        email=payload.email,
        password_hash=hashear_password(payload.password),
        empresa_id=payload.empresa_id,
        persona_id=payload.persona_id,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.post("/login", response_model=TokenSalida)
def login(payload: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.execute(
        select(Usuario).where(Usuario.email == payload.email)
    ).scalar_one_or_none()

    if usuario is None or not verificar_password(payload.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales invalidas",
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )

    nombres_roles = db.execute(
        select(Rol.nombre)
        .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
        .where(UsuarioRol.usuario_id == usuario.id)
    ).scalars().all()

    token = crear_access_token(
        sub=usuario.email,
        empresa_id=usuario.empresa_id,
        usuario_id=usuario.id,
        roles=list(nombres_roles),
    )

    return TokenSalida(
        access_token=token,
        usuario=UsuarioSalida.model_validate(usuario),
        roles=list(nombres_roles),
    )
