from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Persona(Base):
    """Datos biograficos puros, separados de la identidad de autenticacion."""
    __tablename__ = "personas"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False)
    apellido_paterno = Column(String)
    apellido_materno = Column(String)
    telefono = Column(String)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    usuarios = relationship("Usuario", back_populates="persona")
    clientes = relationship("Cliente", back_populates="persona")
