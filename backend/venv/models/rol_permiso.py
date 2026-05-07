from sqlalchemy import Column, Integer, ForeignKey
from app.database.base import Base
from sqlalchemy.orm import relationship

class RolPermiso(Base):
    __tablename__ = "rol_permiso"

    id = Column(Integer, primary_key=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol"))
    id_permiso = Column(Integer, ForeignKey("permisos.id_permiso"))

    rol = relationship("Rol")
    permiso = relationship("Permiso")