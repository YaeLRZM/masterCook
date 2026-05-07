from sqlalchemy import Column, Integer, ForeignKey
from app.database.base import Base
from sqlalchemy.orm import relationship

class UsuarioRol(Base):
    __tablename__ = "usuario_rol"

    id = Column(Integer, primary_key=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_rol = Column(Integer, ForeignKey("roles.id_rol"))

    usuario = relationship("Usuario")
    rol = relationship("Rol")
