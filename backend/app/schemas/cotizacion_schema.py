from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class CotizacionDetalleCrear(BaseModel):
    receta_id: int
    cantidad_porciones: int = Field(gt=0)
    precio_unitario: float = Field(ge=0)


class CotizacionDetalleSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    receta_id: int
    cantidad_porciones: int
    precio_unitario: float
    subtotal: float


class CotizacionCrear(BaseModel):
    cliente_id: int
    nombre_evento: str = Field(min_length=1, max_length=160)
    fecha_evento: datetime
    personas_estimadas: int = Field(gt=0)
    detalles: List[CotizacionDetalleCrear] = []


class CotizacionActualizar(BaseModel):
    nombre_evento: Optional[str] = None
    fecha_evento: Optional[datetime] = None
    personas_estimadas: Optional[int] = None
    estatus: Optional[str] = None  # BORRADOR / APROBADA / CANCELADA
    detalles: Optional[List[CotizacionDetalleCrear]] = None


class CotizacionSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: int
    cliente_id: int
    nombre_evento: str
    fecha_evento: datetime
    personas_estimadas: int
    estatus: str
    costo_operativo: float
    precio_venta: float
    detalles: List[CotizacionDetalleSalida] = []
