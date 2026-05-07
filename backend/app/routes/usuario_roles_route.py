from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.usuario_roles_service import *
from app.auth.dependencies import require_permission

router = APIRouter(prefix="/usuarios-roles", tags=["Usuarios-Roles"])

@router.post("/")
def asignarRol(
    id_usuario: int,
    id_rol: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("asignar_roles"))
):
    return asignar_rol(db, id_usuario, id_rol)

@router.delete("/")
def quitarRol(
    id_usuario: int,
    id_rol: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("quitar_roles"))
):
    return quitar_rol(db, id_usuario, id_rol)
