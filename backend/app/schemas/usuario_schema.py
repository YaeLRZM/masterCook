from pydantic import BaseModel
from typing import Optional
from datetime import date

class UsuarioCreate(BaseModel):
    nombre: str
    correo: str
    password: str
    id_rol: int

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[str] = None
    id_rol: Optional[int] = None
    password: Optional[str] = None

class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: str
    rol: str
    id_rol: int
    fecha_creacion: date
    activo: bool

    class Config:
        from_attributes = True
