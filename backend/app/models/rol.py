from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Rol(Base):
    """Roles RBAC globales del sistema."""
    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("nombre", name="uq_rol_nombre"),
    )

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String, nullable=False, unique=True)
    descripcion = Column(String)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    usuarios = relationship("UsuarioRol", back_populates="rol", cascade="all, delete-orphan")
