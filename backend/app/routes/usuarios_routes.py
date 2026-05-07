from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import require_permission
from app.schemas.usuario_schema import UsuarioCreate, UsuarioUpdate
from app.services.usuarios_service import *

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/")
def get_usuarios(
    db: Session = Depends(get_db),
    user = Depends(require_permission("ver_usuarios"))
):
    return obtener_usuarios(db)

@router.post("/")
def create_usuario(
    data: UsuarioCreate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("crear_usuario"))
):
    try:
        return crear_usuario(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{id_usuario}")
def update_usuario(
    id_usuario: int,
    data: UsuarioUpdate,
    db: Session = Depends(get_db),
    user = Depends(require_permission("editar_usuario"))
):
    try:
        return actualizar_usuario(db, id_usuario, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/{id_usuario}/estado")
def toggle_estado(
    id_usuario: int,
    db: Session = Depends(get_db),
    user = Depends(require_permission("eliminar_usuario"))
):
    try:
        return cambiar_estado_usuario(db, id_usuario)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
