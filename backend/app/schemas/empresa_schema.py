from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime


class EmpresaCrear(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    email: EmailStr
    telefono: Optional[str] = Field(default=None, max_length=20)
    direccion: Optional[str] = Field(default=None, max_length=200)
    rfc: Optional[str] = Field(default=None, max_length=20)


class EmpresaActualizar(BaseModel):
    nombre: Optional[str] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    rfc: Optional[str] = None
    estatus: Optional[str] = None


class EmpresaSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    email: EmailStr
    telefono: Optional[str]
    direccion: Optional[str]
    rfc: Optional[str]
    estatus: str
    activa: bool
    creado_en: Optional[datetime]
