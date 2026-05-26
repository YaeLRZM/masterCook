from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List


# ---- Autenticacion --------------------------------------------------------

class UsuarioCrear(BaseModel):
    """Registro libre (bootstrap / dev). En produccion conviene cerrarlo."""
    nombre_login: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=120)
    empresa_id: Optional[int] = None
    persona_id: Optional[int] = None


class UsuarioLogin(BaseModel):
    email: EmailStr
    password: str


# ---- Alta de personal por parte del ADMIN --------------------------------

class UsuarioStaffCrear(BaseModel):
    """
    Lo usa el ADMIN de una empresa para dar de alta a su personal
    (chefs, ayudantes, meseros...). El empresa_id se toma del token,
    no se acepta en el body.
    """
    nombre_login: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=120)

    # Datos biograficos opcionales -> crean una Persona ligada.
    nombre: Optional[str] = Field(default=None, max_length=80)
    apellido_paterno: Optional[str] = Field(default=None, max_length=80)
    apellido_materno: Optional[str] = Field(default=None, max_length=80)
    telefono: Optional[str] = Field(default=None, max_length=20)

    # Roles a asignar al momento del alta (validados contra roles reservados).
    roles_ids: List[int] = []


class UsuarioActualizar(BaseModel):
    nombre_login: Optional[str] = None
    estatus: Optional[str] = None
    activo: Optional[bool] = None


class CambiarContraseña(BaseModel):
    new_password: str = Field(min_length=6, max_length=120)


# ---- Bootstrap del ADMIN de una empresa (lo hace el SUPER_ADMIN) ---------

class AdminEmpresaCrear(BaseModel):
    nombre_login: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=120)

    nombre: str = Field(min_length=1, max_length=80)
    apellido_paterno: Optional[str] = Field(default=None, max_length=80)
    apellido_materno: Optional[str] = Field(default=None, max_length=80)
    telefono: Optional[str] = Field(default=None, max_length=20)

    cargo: str = Field(default="Representante Legal", max_length=80)


# ---- Salidas --------------------------------------------------------------

class UsuarioSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: Optional[int]
    persona_id: Optional[int]
    nombre_login: str
    email: EmailStr
    estatus: str
    activo: bool


class UsuarioConRolesSalida(UsuarioSalida):
    roles: List[str] = []


class AdministradorListadoSalida(BaseModel):
    """Fila para la pantalla 'Administradores' del SUPER_ADMIN."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str                       # nombre_login del usuario
    email: EmailStr
    empresa: str                      # nombre de la empresa
    empresa_id: int
    estatus: str
    activo: bool
    telefono: Optional[str] = None    # de la Persona ligada


class TokenSalida(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioSalida
    roles: List[str] = []
