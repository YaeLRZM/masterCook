from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.roles_permisos_service import *
from app.auth.dependencies import require_permission

router = APIRouter(prefix="/roles-permisos", tags=["Roles-Permisos"])

@router.post("/")
def asignar_permiso(
    id_rol: int,
    id_permiso: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("asignar_permisos"))
):
    return asignar_permiso_a_rol(db, id_rol, id_permiso)

@router.delete("/")
def quitar_permiso(
    id_rol: int,
    id_permiso: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("quitar_permisos"))
):
    return quitar_permiso_de_rol(db, id_rol, id_permiso)

@router.get("/rol/{id_rol}")
def ver_permisos_de_rol(
    id_rol: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("ver_permisos"))
):
    return obtener_permisos_por_rol(db, id_rol)

@router.get("/roles")
def ver_roles_con_permisos(
    db: Session = Depends(get_db),
    user = Depends(require_permission("ver_permisos"))
):
    return obtener_roles_con_permisos(db)
