from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class UnidadMedida(Base):
    """Catalogo general de unidades (Kilos, Litros, Piezas, etc.)."""
    __tablename__ = "unidades_medida"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False, unique=True)
    abreviatura = Column(String, nullable=False, unique=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    conversiones_origen = relationship(
        "ConversionUnidad",
        foreign_keys="ConversionUnidad.unidad_origen_id",
        back_populates="unidad_origen",
    )
    conversiones_destino = relationship(
        "ConversionUnidad",
        foreign_keys="ConversionUnidad.unidad_destino_id",
        back_populates="unidad_destino",
    )
