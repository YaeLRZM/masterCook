from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Ingrediente(Base):
    """
    Inventario de insumos por empresa.

    merma_porcentaje se calcula en el backend con:
        ((peso_bruto - peso_neto) / peso_bruto) * 100
    """
    __tablename__ = "ingredientes"

    id = Column(Integer, primary_key=True, index=True)

    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False, index=True)
    creado_por = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    unidad_medida_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)

    nombre = Column(String, nullable=False)

    costo_base = Column(Float, nullable=False, default=0)
    peso_bruto = Column(Float, default=0)
    peso_neto = Column(Float, default=0)
    merma_porcentaje = Column(Float, default=0)

    stock = Column(Float, default=0)
    stock_minimo = Column(Float, default=0)

    imagen_url = Column(String, nullable=True)

    activo = Column(Boolean, default=True)

    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    empresa = relationship("Empresa", back_populates="ingredientes")
    creador = relationship("Usuario")
    unidad_medida = relationship("UnidadMedida")
    recetas = relationship("RecetaIngrediente", back_populates="ingrediente")
