from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class PersonaCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=80)
    apellido_paterno: Optional[str] = Field(default=None, max_length=80)
    apellido_materno: Optional[str] = Field(default=None, max_length=80)
    telefono: Optional[str] = Field(default=None, max_length=20)


class PersonaSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    apellido_paterno: Optional[str]
    apellido_materno: Optional[str]
    telefono: Optional[str]
