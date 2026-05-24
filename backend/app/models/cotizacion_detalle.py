from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.database.database import Base


class CotizacionDetalle(Base):
    """Platillos (recetas) que se serviran en el evento cotizado."""
    __tablename__ = "cotizaciones_detalles"

    id = Column(Integer, primary_key=True, index=True)

    cotizacion_id = Column(Integer, ForeignKey("cotizaciones.id"), nullable=False, index=True)
    receta_id = Column(Integer, ForeignKey("recetas.id"), nullable=False, index=True)

    cantidad_porciones = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    cotizacion = relationship("Cotizacion", back_populates="detalles")
    receta = relationship("Receta", back_populates="detalles_cotizacion")
