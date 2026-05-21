from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.base import Base

class Empresa(Base):
    __tablename__ = "Empresa"

    id_empresa = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    direccion = Column(String)
    telefono = Column(String)
    email = Column(String, unique=True, index=True)
    estatus = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())