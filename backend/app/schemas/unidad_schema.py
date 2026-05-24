from pydantic import BaseModel, Field, ConfigDict


class UnidadMedidaCrear(BaseModel):
    nombre: str = Field(min_length=1, max_length=40)
    abreviatura: str = Field(min_length=1, max_length=10)


class UnidadMedidaSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    abreviatura: str


class ConversionUnidadCrear(BaseModel):
    unidad_origen_id: int
    unidad_destino_id: int
    factor_multiplicador: float = Field(gt=0)


class ConversionUnidadSalida(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    unidad_origen_id: int
    unidad_destino_id: int
    factor_multiplicador: float
