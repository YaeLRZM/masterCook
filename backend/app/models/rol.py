from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Rol(Base):
    """Roles RBAC, propiedad de cada empresa (tenant-scoped)."""
    __tablename__ = "roles"
    __table_args__ = (
        UniqueConstraint("empresa_id", "nombre", name="uq_rol_empresa_nombre"),
    )

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False, index=True)

    nombre = Column(String, nullable=False)
    descripcion = Column(String)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="roles")
    usuarios = relationship("UsuarioRol", back_populates="rol", cascade="all, delete-orphan")
