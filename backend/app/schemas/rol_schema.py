from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class RolCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=200)


class RolSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: Optional[str]


class UsuarioRolAsignar(BaseModel):
    usuario_id: int
    rol_id: int
