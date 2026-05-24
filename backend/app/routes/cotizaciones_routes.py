from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_empresa_actual_id,
    obtener_objeto_del_tenant,
    obtener_usuario_actual,
)
from app.models.cotizacion import Cotizacion
from app.models.cotizacion_detalle import CotizacionDetalle
from app.models.cliente import Cliente
from app.models.receta import Receta
from app.models.usuario import Usuario
from app.schemas.cotizacion_schema import (
    CotizacionCrear,
    CotizacionActualizar,
    CotizacionSalida,
)
from app.services.cotizacion_service import recalcular_totales_cotizacion


router = APIRouter(prefix="/cotizaciones", tags=["Cotizaciones"])


def _validar_cliente_del_tenant(db: Session, cliente_id: int, empresa_id: int):
    encontrado = db.execute(
        select(Cliente.id).where(
            Cliente.id == cliente_id,
            Cliente.empresa_id == empresa_id,
        )
    ).scalar_one_or_none()
    if encontrado is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El cliente no pertenece a tu empresa",
        )


def _validar_recetas_del_tenant(
    db: Session, receta_ids: List[int], empresa_id: int
):
    if not receta_ids:
        return
    encontradas = db.execute(
        select(Receta.id).where(
            Receta.id.in_(receta_ids),
            Receta.empresa_id == empresa_id,
        )
    ).scalars().all()
    if len(encontradas) != len(set(receta_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Una o mas recetas no pertenecen a tu empresa",
        )


@router.get("/", response_model=List[CotizacionSalida])
def listar_cotizaciones(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return db.execute(
        select(Cotizacion).where(Cotizacion.empresa_id == empresa_id)
    ).scalars().all()


@router.post(
    "/",
    response_model=CotizacionSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_cotizacion(
    payload: CotizacionCrear,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    _validar_cliente_del_tenant(db, payload.cliente_id, empresa_id)
    _validar_recetas_del_tenant(
        db, [d.receta_id for d in payload.detalles], empresa_id
    )

    cotizacion = Cotizacion(
        empresa_id=empresa_id,
        cliente_id=payload.cliente_id,
        creado_por=usuario.id,
        nombre_evento=payload.nombre_evento,
        fecha_evento=payload.fecha_evento,
        personas_estimadas=payload.personas_estimadas,
    )
    db.add(cotizacion)
    db.flush()

    for d in payload.detalles:
        db.add(CotizacionDetalle(
            cotizacion_id=cotizacion.id,
            receta_id=d.receta_id,
            cantidad_porciones=d.cantidad_porciones,
            precio_unitario=d.precio_unitario,
            subtotal=d.precio_unitario * d.cantidad_porciones,
        ))

    db.commit()
    db.refresh(cotizacion)

    recalcular_totales_cotizacion(db, cotizacion, persistir=True)
    db.refresh(cotizacion)
    return cotizacion


@router.get("/{cotizacion_id}", response_model=CotizacionSalida)
def obtener_cotizacion(
    cotizacion_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return obtener_objeto_del_tenant(db, Cotizacion, cotizacion_id, empresa_id)


@router.patch("/{cotizacion_id}", response_model=CotizacionSalida)
def actualizar_cotizacion(
    cotizacion_id: int,
    payload: CotizacionActualizar,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    cotizacion = obtener_objeto_del_tenant(
        db, Cotizacion, cotizacion_id, empresa_id
    )

    datos = payload.model_dump(exclude_unset=True)
    nuevos_detalles = datos.pop("detalles", None)

    for campo, valor in datos.items():
        setattr(cotizacion, campo, valor)

    if nuevos_detalles is not None:
        _validar_recetas_del_tenant(
            db, [d["receta_id"] for d in nuevos_detalles], empresa_id
        )
        for viejo in list(cotizacion.detalles):
            db.delete(viejo)
        db.flush()
        for d in nuevos_detalles:
            db.add(CotizacionDetalle(
                cotizacion_id=cotizacion.id,
                receta_id=d["receta_id"],
                cantidad_porciones=d["cantidad_porciones"],
                precio_unitario=d["precio_unitario"],
                subtotal=d["precio_unitario"] * d["cantidad_porciones"],
            ))

    db.commit()
    db.refresh(cotizacion)
    recalcular_totales_cotizacion(db, cotizacion, persistir=True)
    db.refresh(cotizacion)
    return cotizacion


@router.delete("/{cotizacion_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cotizacion(
    cotizacion_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    cotizacion = obtener_objeto_del_tenant(
        db, Cotizacion, cotizacion_id, empresa_id
    )
    db.delete(cotizacion)
    db.commit()
