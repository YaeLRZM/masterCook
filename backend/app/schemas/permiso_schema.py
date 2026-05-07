from pydantic import BaseModel

class PermisoCreate(BaseModel):
    nombre: str
    descripcion: str | None = None

class PermisoResponse(BaseModel):
    id_permiso: int
    nombre: str
    descripcion: str | None

    class Config:
        from_attributes = True
