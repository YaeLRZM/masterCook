from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Auditoria(Base):
    """Bitacora del sistema: quien hizo que, en cual tabla, a que hora."""
    __tablename__ = "auditorias"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=True, index=True)
    hecho_por = Column(Integer, ForeignKey("usuarios.id"), nullable=False, index=True)

    nombre_tabla = Column(String, nullable=False)
    id_tabla = Column(Integer)
    tipo_movimiento = Column(String, nullable=False)
    modulo = Column(String)

    descripcion = Column(Text)
    ip = Column(String)

    fecha = Column(DateTime(timezone=True), server_default=func.now())

    empresa = relationship("Empresa")
    usuario = relationship("Usuario")
