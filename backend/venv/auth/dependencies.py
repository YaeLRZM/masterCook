from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.persona import Persona
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol
from app.models.rol_permiso import RolPermiso
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(401, "Token inválido")

    except JWTError:
        raise HTTPException(401, "Token inválido")

    usuario = db.query(Usuario).filter_by(id_usuario=user_id).first()

    if not usuario:
        raise HTTPException(404, "Usuario no encontrado")

    return usuario

def get_user_roles(usuario, db):
    roles_rel = db.query(UsuarioRol).filter_by(id_usuario=usuario.id_usuario).all()
    return [r.rol.nombre for r in roles_rel]

def get_user_permissions(usuario, db):
    permisos = set()

    roles_rel = db.query(UsuarioRol).filter_by(id_usuario=usuario.id_usuario).all()

    for rel in roles_rel:
        rol_permisos = db.query(RolPermiso).filter_by(id_rol=rel.id_rol).all()
        for rp in rol_permisos:
            permisos.add(rp.permiso.nombre)

    return permisos

def require_permission(permission: str):
    def permission_checker(
        usuario = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        permisos = get_user_permissions(usuario, db)

        if permission not in permisos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta acción"
            )

        return usuario

    return permission_checker