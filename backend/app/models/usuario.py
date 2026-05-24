from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=True, index=True)
    persona_id = Column(Integer, ForeignKey("personas.id"), nullable=True, index=True)

    nombre_login = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    estatus = Column(String, default="ACTIVO")
    activo = Column(Boolean, default=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="usuarios")
    persona = relationship("Persona", back_populates="usuarios")
    roles = relationship("UsuarioRol", back_populates="usuario", cascade="all, delete-orphan")
    representante = relationship("Representante", back_populates="usuario", uselist=False)
