from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Receta(Base):
    """Define un platillo o una preparacion base (sub-receta)."""
    __tablename__ = "recetas"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False, index=True)
    creado_por = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    nombre = Column(String, nullable=False)
    procedimiento = Column(Text)
    rendimiento_porciones = Column(Integer, default=1)

    imagen_url = Column(String)  # ruta publica servida por /uploads

    costo_total_calculado = Column(Float, default=0)
    es_subreceta = Column(Boolean, default=False)

    activa = Column(Boolean, default=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="recetas")
    creador = relationship("Usuario")
    ingredientes = relationship(
        "RecetaIngrediente",
        back_populates="receta",
        cascade="all, delete-orphan",
    )
    detalles_cotizacion = relationship("CotizacionDetalle", back_populates="receta")
