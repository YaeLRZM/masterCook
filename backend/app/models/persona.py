from sqlalchemy import Column, Integer, String, Date
from app.database.base import Base

class Persona(Base):
    __tablename__ = "personas"

    id_persona = Column(Integer, primary_key=True, index=True)
    correo = Column(String, unique=True, index=True)
    nombre = Column(String)
    fecha_creacion = Column(Date)
