from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Empresa(Base):
    """Empresa (Tenant). Toda fila operativa se filtra por empresa_id."""
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    direccion = Column(String)
    telefono = Column(String)
    email = Column(String, unique=True, nullable=False)
    rfc = Column(String, index=True)

    estatus = Column(String, default="ACTIVA")
    activa = Column(Boolean, default=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    usuarios = relationship("Usuario", back_populates="empresa")
    roles = relationship("Rol", back_populates="empresa")
    clientes = relationship("Cliente", back_populates="empresa")
    ingredientes = relationship("Ingrediente", back_populates="empresa")
    recetas = relationship("Receta", back_populates="empresa")
    cotizaciones = relationship("Cotizacion", back_populates="empresa")
