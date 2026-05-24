from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class RecetaIngrediente(Base):
    """Pivote Recetas <-> Ingredientes. Cantidad expresada en una unidad concreta."""
    __tablename__ = "recetas_ingredientes"

    id = Column(Integer, primary_key=True, index=True)

    receta_id = Column(Integer, ForeignKey("recetas.id"), nullable=False, index=True)
    ingrediente_id = Column(Integer, ForeignKey("ingredientes.id"), nullable=False, index=True)
    unidad_medida_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)

    cantidad = Column(Float, nullable=False)

    receta = relationship("Receta", back_populates="ingredientes")
    ingrediente = relationship("Ingrediente", back_populates="recetas")
    unidad_medida = relationship("UnidadMedida")
