"""
Calculo dinamico del costo total de una receta.

Reglas:
  - Por cada ingrediente de la receta:
      cantidad_en_unidad_del_ingrediente =
          cantidad_receta * factor_conversion(unidad_receta -> unidad_ingrediente)
      costo_efectivo_por_unidad =
          costo_base / (1 - merma_porcentaje / 100)
      subtotal_ingrediente =
          cantidad_en_unidad_del_ingrediente * costo_efectivo_por_unidad
  - costo_total_calculado = suma de subtotales
  - Se respeta el aislamiento del tenant: solo se consideran ingredientes
    pertenecientes a la misma empresa que la receta.
"""

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.receta import Receta
from app.models.receta_ingrediente import RecetaIngrediente
from app.models.ingrediente import Ingrediente

from app.services.conversion_service import obtener_factor_conversion


def _costo_efectivo_por_unidad(costo_base: float, merma_porcentaje: float) -> float:
    """
    La merma encarece el costo efectivo: si pierdo 20% del ingrediente,
    el costo de la parte aprovechable es costo_base / 0.80.
    """
    if merma_porcentaje is None or merma_porcentaje <= 0:
        return float(costo_base or 0)
    if merma_porcentaje >= 100:
        return float(costo_base or 0)
    factor_aprovechable = 1 - (merma_porcentaje / 100.0)
    return float(costo_base or 0) / factor_aprovechable


def calcular_costo_receta(
    db: Session,
    receta: Receta,
    persistir: bool = True,
) -> float:
    detalles = db.execute(
        select(RecetaIngrediente).where(RecetaIngrediente.receta_id == receta.id)
    ).scalars().all()

    total = 0.0
    for detalle in detalles:
        ingrediente = db.execute(
            select(Ingrediente).where(
                Ingrediente.id == detalle.ingrediente_id,
                Ingrediente.empresa_id == receta.empresa_id,  # filtro tenant
            )
        ).scalar_one_or_none()

        if ingrediente is None:
            continue

        try:
            factor = obtener_factor_conversion(
                db,
                unidad_origen_id=detalle.unidad_medida_id,
                unidad_destino_id=ingrediente.unidad_medida_id,
            )
        except ValueError:
            # Si no hay conversion, usar la cantidad tal cual (asumir misma unidad)
            factor = 1.0

        cantidad_normalizada = detalle.cantidad * factor
        costo_unitario = _costo_efectivo_por_unidad(
            ingrediente.costo_base,
            ingrediente.merma_porcentaje,
        )

        total += cantidad_normalizada * costo_unitario

    if persistir:
        receta.costo_total_calculado = round(total, 4)
        db.add(receta)
        db.commit()
        db.refresh(receta)

    return round(total, 4)
