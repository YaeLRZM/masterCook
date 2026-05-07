from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.rol_schema import RolCreate, RolResponse
from app.services.rol_service import *
from app.auth.dependencies import require_permission

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.get("/", response_model=list[RolResponse])
def getRoles(
    db: Session = Depends(get_db),
    user = Depends(require_permission("ver_roles"))
):
    return obtener_roles(db)

@router.post("/", response_model=RolResponse)
def createRol(
    datos: RolCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("crear_rol"))
):
    try:
        return crear_rol(db, datos.nombre, datos.descripcion)
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.put("/{id_rol}", response_model=RolResponse)
def updateRol(
    id_rol: int,
    datos: RolCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("editar_rol"))
):
    try:
        return actualizar_rol(db, id_rol, datos.nombre, datos.descripcion)
    except ValueError as e:
        raise HTTPException(404, str(e))

@router.delete("/{id_rol}")
def deleteRol(
    id_rol: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("eliminar_rol"))
):
    try:
        return eliminar_rol(db, id_rol)
    except ValueError as e:
        raise HTTPException(404, str(e))
