from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.persona import Persona
from app.models.usuario import Usuario
from app.models.usuario_rol import UsuarioRol
from app.models.rol_permiso import RolPermiso
from app.schemas.auth_schema import LoginRequest
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    persona = db.query(Persona).filter_by(correo=data.correo).first()
    if not persona:
        raise HTTPException(400, "Credenciales incorrectas")

    usuario = db.query(Usuario).filter_by(id_persona=persona.id_persona).first()

    if not verify_password(data.password, usuario.password):
        raise HTTPException(400, "Credenciales incorrectas")

    roles_rel = db.query(UsuarioRol).filter_by(id_usuario=usuario.id_usuario).all()
    roles = [r.rol.nombre.capitalize() for r in roles_rel]
    roles_texto = " y ".join(roles)

    permisos_set = set()
    for rel in roles_rel:
        rol_permisos = db.query(RolPermiso).filter_by(id_rol=rel.id_rol).all()
        for rp in rol_permisos:
            permisos_set.add(rp.permiso.nombre)

    token = create_access_token({"sub": str(usuario.id_usuario)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "nombre": persona.nombre,
        "correo": persona.correo,
        "roles": roles_texto,
        "permisos": list(permisos_set)
    }
