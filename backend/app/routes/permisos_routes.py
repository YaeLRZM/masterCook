from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.permiso_schema import PermisoCreate
from app.services.permisos_service import *
from app.auth.dependencies import require_permission

router = APIRouter(prefix="/permisos", tags=["Permisos"])

@router.get("/")
def getPermisos(
    db: Session = Depends(get_db),
    user = Depends(require_permission("ver_permisos"))
):
    return obtener_permisos(db)

@router.post("/")
def createPermiso(
    datos: PermisoCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("crear_permiso"))
):
    try:
        return crear_permiso(db, datos.nombre, datos.descripcion)
    except ValueError as e:
        raise HTTPException(400, str(e))

@router.put("/{id_permiso}")
def updatePermiso(
    id_permiso: int,
    datos: PermisoCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("editar_permiso"))
):
    try:
        return actualizar_permiso(db, id_permiso, datos.nombre, datos.descripcion)
    except ValueError as e:
        raise HTTPException(404, str(e))

@router.delete("/{id_permiso}")
def deletePermiso(
    id_permiso: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("eliminar_permiso"))
):
    try:
        return eliminar_permiso(db, id_permiso)
    except ValueError as e:
        raise HTTPException(404, str(e))
