from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List


class UsuarioCrear(BaseModel):
    nombre_login: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=120)
    empresa_id: Optional[int] = None
    persona_id: Optional[int] = None
    rol_inicial: Optional[str] = None  # legacy: rol como string


class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str


class UsuarioSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: Optional[int]
    persona_id: Optional[int]
    nombre_login: str
    email: EmailStr
    estatus: str
    activo: bool


class TokenSalida(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioSalida
    roles: List[str] = []
