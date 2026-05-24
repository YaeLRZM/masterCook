from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Cliente(Base):
    """Cliente al que se cotizan eventos. No tiene acceso al sistema."""
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False, index=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=True, index=True)

    rfc = Column(String, index=True)
    razon_social = Column(String)
    email = Column(String)
    telefono = Column(String)
    direccion = Column(String)

    activo = Column(Boolean, default=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="clientes")
    persona = relationship("Persona", back_populates="clientes")
    cotizaciones = relationship("Cotizacion", back_populates="cliente")
