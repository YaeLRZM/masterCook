from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List


class RecetaIngredienteCrear(BaseModel):
    ingrediente_id: int
    unidad_medida_id: int
    cantidad: float = Field(gt=0)


class RecetaIngredienteSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ingrediente_id: int
    unidad_medida_id: int
    cantidad: float


class RecetaCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=120)
    procedimiento: Optional[str] = None
    rendimiento_porciones: int = Field(default=1, gt=0)
    es_subreceta: bool = False
    ingredientes: List[RecetaIngredienteCrear] = []


class RecetaActualizar(BaseModel):
    nombre: Optional[str] = None
    procedimiento: Optional[str] = None
    rendimiento_porciones: Optional[int] = None
    es_subreceta: Optional[bool] = None
    activa: Optional[bool] = None
    ingredientes: Optional[List[RecetaIngredienteCrear]] = None


class RecetaSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    empresa_id: int
    nombre: str
    procedimiento: Optional[str]
    rendimiento_porciones: int
    imagen_url: Optional[str] = None
    costo_total_calculado: float
    es_subreceta: bool
    activa: bool
    ingredientes: List[RecetaIngredienteSalida] = []
