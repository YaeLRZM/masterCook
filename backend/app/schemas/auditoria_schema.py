from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class AuditoriaSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: Optional[int]
    hecho_por: int
    nombre_tabla: str
    id_tabla: Optional[int]
    tipo_movimiento: str  # INSERT, UPDATE, DELETE
    modulo: Optional[str]
    descripcion: Optional[str]
    ip: Optional[str]
    fecha: datetime
