"""
Resuelve conversiones entre unidades de medida usando la tabla
`conversiones_unidades`. Si origen == destino el factor es 1.
"""

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.conversion_unidad import ConversionUnidad


def obtener_factor_conversion(
    db: Session,
    unidad_origen_id: int,
    unidad_destino_id: int,
) -> float:
    if unidad_origen_id == unidad_destino_id:
        return 1.0

    # Conversion directa.
    factor = db.execute(
        select(ConversionUnidad.factor_multiplicador).where(
            ConversionUnidad.unidad_origen_id == unidad_origen_id,
            ConversionUnidad.unidad_destino_id == unidad_destino_id,
        )
    ).scalar_one_or_none()

    if factor is not None:
        return float(factor)

    # Conversion inversa (si Kg -> g = 1000 entonces g -> Kg = 1/1000).
    inverso = db.execute(
        select(ConversionUnidad.factor_multiplicador).where(
            ConversionUnidad.unidad_origen_id == unidad_destino_id,
            ConversionUnidad.unidad_destino_id == unidad_origen_id,
        )
    ).scalar_one_or_none()

    if inverso is not None and inverso != 0:
        return 1.0 / float(inverso)

    raise ValueError(
        f"No existe conversion entre la unidad {unidad_origen_id} "
        f"y la unidad {unidad_destino_id}."
    )
