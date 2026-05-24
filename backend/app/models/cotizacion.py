from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Cotizacion(Base):
    """El evento a vender al cliente."""
    __tablename__ = "cotizaciones"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=False, index=True)
    creado_por = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    nombre_evento = Column(String, nullable=False)
    fecha_evento = Column(DateTime, nullable=False)
    personas_estimadas = Column(Integer, nullable=False)

    estatus = Column(String, default="BORRADOR")  # BORRADOR / APROBADA / CANCELADA

    costo_operativo = Column(Float, default=0)
    precio_venta = Column(Float, default=0)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="cotizaciones")
    cliente = relationship("Cliente", back_populates="cotizaciones")
    creador = relationship("Usuario")
    detalles = relationship(
        "CotizacionDetalle",
        back_populates="cotizacion",
        cascade="all, delete-orphan",
    )
