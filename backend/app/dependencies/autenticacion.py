"""
Dependencias de autenticacion y aislamiento multi-tenant.

Flujo:
  1. El cliente envia el JWT en el header Authorization: Bearer <token>.
  2. `obtener_usuario_actual` decodifica el token y carga el Usuario.
  3. `obtener_empresa_actual_id` extrae el empresa_id del token y lo retorna
     listo para inyectar como filtro en cualquier consulta SQLAlchemy.
  4. `con_filtro_tenant` es un helper para aplicar el filtro de forma uniforme.

Cualquier endpoint que reciba `empresa_id: int = Depends(obtener_empresa_actual_id)`
queda automaticamente aislado al tenant del usuario logueado.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError

from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Type

from app.database.database import get_db
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol
from app.models.rol import Rol

from app.core.config import SECRET_KEY, ALGORITHM


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _decodificar_token(token: str) -> dict:
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalido",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise credenciales_invalidas

    if payload.get("sub") is None:
        raise credenciales_invalidas

    return payload


def obtener_usuario_actual(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    """Resuelve el Usuario autenticado a partir del JWT."""
    payload = _decodificar_token(token)
    email = payload.get("sub")

    usuario = db.execute(
        select(Usuario).where(Usuario.email == email)
    ).scalar_one_or_none()

    if usuario is None or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario inexistente o inactivo",
        )

    return usuario


def obtener_empresa_actual_id(
    usuario: Usuario = Depends(obtener_usuario_actual),
) -> int:
    """
    Devuelve el empresa_id del usuario autenticado.

    Cualquier endpoint que dependa de esta funcion queda obligado a filtrar
    por empresa_id en sus consultas, garantizando el aislamiento del tenant.
    """
    if usuario.empresa_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El usuario no esta asociado a una empresa",
        )
    return usuario.empresa_id


def con_filtro_tenant(query, modelo, empresa_id: int):
    """
    Aplica `WHERE modelo.empresa_id = :empresa_id` a una consulta SQLAlchemy.

    Uso:
        consulta = select(Ingrediente)
        consulta = con_filtro_tenant(consulta, Ingrediente, empresa_id)
    """
    return query.where(modelo.empresa_id == empresa_id)


def obtener_objeto_del_tenant(
    db: Session,
    modelo: Type,
    objeto_id: int,
    empresa_id: int,
):
    """
    Recupera una fila por id forzando que pertenezca al tenant del usuario.
    Lanza 404 si no existe o si pertenece a otra empresa.
    """
    consulta = select(modelo).where(
        modelo.id == objeto_id,
        modelo.empresa_id == empresa_id,
    )
    objeto = db.execute(consulta).scalar_one_or_none()
    if objeto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{modelo.__name__} no encontrado",
        )
    return objeto


def requiere_roles(roles_permitidos: List[str]):
    """
    Verifica que el usuario tenga al menos uno de los roles permitidos
    dentro de su propia empresa (RBAC tenant-scoped).
    """
    def verificador(
        usuario: Usuario = Depends(obtener_usuario_actual),
        db: Session = Depends(get_db),
    ) -> Usuario:
        nombres_roles = db.execute(
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(
                UsuarioRol.usuario_id == usuario.id,
                Rol.empresa_id == usuario.empresa_id,
            )
        ).scalars().all()

        # Compatibilidad con el campo legacy `usuario.estatus` / rol string.
        roles_totales = set(nombres_roles)

        if not roles_totales.intersection(roles_permitidos):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permisos insuficientes",
            )
        return usuario

    return verificador
