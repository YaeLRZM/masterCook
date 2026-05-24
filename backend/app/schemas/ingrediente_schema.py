from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class IngredienteCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=120)
    unidad_medida_id: int
    costo_base: float = Field(ge=0)
    peso_bruto: Optional[float] = Field(default=0, ge=0)
    peso_neto: Optional[float] = Field(default=0, ge=0)
    stock: Optional[float] = Field(default=0, ge=0)
    stock_minimo: Optional[float] = Field(default=0, ge=0)


class IngredienteActualizar(BaseModel):
    nombre: Optional[str] = None
    unidad_medida_id: Optional[int] = None
    costo_base: Optional[float] = None
    peso_bruto: Optional[float] = None
    peso_neto: Optional[float] = None
    stock: Optional[float] = None
    stock_minimo: Optional[float] = None
    activo: Optional[bool] = None


class IngredienteSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: int
    nombre: str
    unidad_medida_id: int
    costo_base: float
    peso_bruto: float
    peso_neto: float
    merma_porcentaje: float
    stock: float
    stock_minimo: float
    activo: bool
