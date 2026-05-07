from pydantic import BaseModel, Field

class RolCreate(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=50)
    descripcion: str | None = None

class RolResponse(BaseModel):
    id_rol: int
    nombre: str
    descripcion: str | None

    class Config:
        from_attributes = True
