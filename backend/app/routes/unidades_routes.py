"""
Unidades de medida y conversiones.

Las unidades son un catalogo global compartido entre tenants (Kilos, Litros,
Piezas, etc.), por eso no se filtra por empresa_id aqui. Solo usuarios con
rol SUPER_ADMIN pueden modificarlas; el resto puede leerlas.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_usuario_actual,
    requiere_roles,
)
from app.models.unidad_medida import UnidadMedida
from app.models.conversion_unidad import ConversionUnidad
from app.schemas.unidad_schema import (
    UnidadMedidaCrear,
    UnidadMedidaSalida,
    ConversionUnidadCrear,
    ConversionUnidadSalida,
)


router = APIRouter(prefix="/unidades", tags=["Unidades"])


@router.get("/", response_model=List[UnidadMedidaSalida])
def listar_unidades(
    db: Session = Depends(get_db),
    _=Depends(obtener_usuario_actual),
):
    return db.execute(select(UnidadMedida)).scalars().all()


@router.post(
    "/",
    response_model=UnidadMedidaSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_unidad(
    payload: UnidadMedidaCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    nueva = UnidadMedida(
        nombre=payload.nombre,
        abreviatura=payload.abreviatura,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/conversiones", response_model=List[ConversionUnidadSalida])
def listar_conversiones(
    db: Session = Depends(get_db),
    _=Depends(obtener_usuario_actual),
):
    return db.execute(select(ConversionUnidad)).scalars().all()


@router.post(
    "/conversiones",
    response_model=ConversionUnidadSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_conversion(
    payload: ConversionUnidadCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    nueva = ConversionUnidad(
        unidad_origen_id=payload.unidad_origen_id,
        unidad_destino_id=payload.unidad_destino_id,
        factor_multiplicador=payload.factor_multiplicador,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva
