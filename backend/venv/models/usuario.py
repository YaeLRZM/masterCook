from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database.base import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_persona = Column(Integer, ForeignKey("personas.id_persona"))
    password = Column(String)
    activo = Column(Boolean, default=True)