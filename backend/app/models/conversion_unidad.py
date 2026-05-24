from sqlalchemy import Column, Integer, Float, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class ConversionUnidad(Base):
    """
    Relaciona una unidad de origen con una destino mediante un factor.
    Ej. Kg -> Gramos = 1000.
    """
    __tablename__ = "conversiones_unidades"
    __table_args__ = (
        UniqueConstraint(
            "unidad_origen_id",
            "unidad_destino_id",
            name="uq_conversion_par",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    unidad_origen_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)
    unidad_destino_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)

    factor_multiplicador = Column(Float, nullable=False)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    unidad_origen = relationship(
        "UnidadMedida",
        foreign_keys=[unidad_origen_id],
        back_populates="conversiones_origen",
    )
    unidad_destino = relationship(
        "UnidadMedida",
        foreign_keys=[unidad_destino_id],
        back_populates="conversiones_destino",
    )
