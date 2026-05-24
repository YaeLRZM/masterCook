from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional


class ClienteCrear(BaseModel):
    persona_id: Optional[int] = None
    rfc: Optional[str] = Field(default=None, max_length=20)
    razon_social: Optional[str] = Field(default=None, max_length=160)
    email: Optional[EmailStr] = None
    telefono: Optional[str] = Field(default=None, max_length=20)
    direccion: Optional[str] = Field(default=None, max_length=200)


class ClienteActualizar(BaseModel):
    rfc: Optional[str] = None
    razon_social: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    direccion: Optional[str] = None
    activo: Optional[bool] = None


class ClienteSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: int
    persona_id: Optional[int]
    rfc: Optional[str]
    razon_social: Optional[str]
    email: Optional[EmailStr]
    telefono: Optional[str]
    direccion: Optional[str]
    activo: bool
