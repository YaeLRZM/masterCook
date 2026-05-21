from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from app.database.base import Base
from sqlalchemy.orm import relationship

class Auditoria(Base):
    __tablename__ = "auditorias"

    id_auditoria = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa"))
    nombre_tabla = Column(String)
    id_tabla = Column(Integer)
    tipo_movimiento = Column(String)
    fecha = Column(DateTime)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))


    empresa = relationship("Empresa")
    usuario = relationship("Usuario")
