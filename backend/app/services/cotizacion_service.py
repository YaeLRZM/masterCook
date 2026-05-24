"""
Logica de negocio para Cotizaciones.

  - costo_operativo = suma del costo de cada receta * cantidad_porciones
  - precio_venta    = suma de (precio_unitario * cantidad_porciones) por detalle
"""

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.cotizacion import Cotizacion
from app.models.cotizacion_detalle import CotizacionDetalle
from app.models.receta import Receta


def recalcular_totales_cotizacion(
    db: Session,
    cotizacion: Cotizacion,
    persistir: bool = True,
) -> Cotizacion:
    detalles = db.execute(
        select(CotizacionDetalle).where(
            CotizacionDetalle.cotizacion_id == cotizacion.id
        )
    ).scalars().all()

    costo_operativo = 0.0
    precio_venta = 0.0

    for detalle in detalles:
        receta = db.execute(
            select(Receta).where(
                Receta.id == detalle.receta_id,
                Receta.empresa_id == cotizacion.empresa_id,  # filtro tenant
            )
        ).scalar_one_or_none()

        if receta is None:
            continue

        # Asumimos rendimiento_porciones >= 1
        porciones_por_receta = max(receta.rendimiento_porciones or 1, 1)
        costo_por_porcion = (receta.costo_total_calculado or 0) / porciones_por_receta

        costo_operativo += costo_por_porcion * detalle.cantidad_porciones

        subtotal = detalle.precio_unitario * detalle.cantidad_porciones
        detalle.subtotal = round(subtotal, 4)
        precio_venta += subtotal

        db.add(detalle)

    cotizacion.costo_operativo = round(costo_operativo, 4)
    cotizacion.precio_venta = round(precio_venta, 4)

    if persistir:
        db.add(cotizacion)
        db.commit()
        db.refresh(cotizacion)

    return cotizacion
