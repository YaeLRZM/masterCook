"""
CRUD de Ingredientes con aislamiento multi-tenant.

Cada endpoint recibe `empresa_id` via Depends(obtener_empresa_actual_id), lo
cual obliga a filtrar (o asignar) la empresa del usuario autenticado en cada
consulta / insercion.

Ademas calcula merma_porcentaje automaticamente a partir de peso_bruto y
peso_neto, sin que el cliente la mande.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_empresa_actual_id,
    obtener_objeto_del_tenant,
    obtener_usuario_actual,
)
from app.models.ingrediente import Ingrediente
from app.models.usuario import Usuario
from app.schemas.ingrediente_schema import (
    IngredienteCrear,
    IngredienteActualizar,
    IngredienteSalida,
)
from app.services.ingrediente_service import calcular_merma_porcentaje


router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])


@router.get("/", response_model=List[IngredienteSalida])
def listar_ingredientes(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    # Filtro tenant garantizado.
    return db.execute(
        select(Ingrediente).where(Ingrediente.empresa_id == empresa_id)
    ).scalars().all()


@router.post(
    "/",
    response_model=IngredienteSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_ingrediente(
    payload: IngredienteCrear,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    merma = calcular_merma_porcentaje(
        peso_bruto=payload.peso_bruto or 0,
        peso_neto=payload.peso_neto or 0,
    )

    nuevo = Ingrediente(
        empresa_id=empresa_id,                # inyeccion del tenant
        creado_por=usuario.id,
        unidad_medida_id=payload.unidad_medida_id,
        nombre=payload.nombre,
        costo_base=payload.costo_base,
        peso_bruto=payload.peso_bruto or 0,
        peso_neto=payload.peso_neto or 0,
        merma_porcentaje=merma,               # calculo automatico
        stock=payload.stock or 0,
        stock_minimo=payload.stock_minimo or 0,
        imagen_url=payload.imagen_url,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{ingrediente_id}", response_model=IngredienteSalida)
def obtener_ingrediente(
    ingrediente_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return obtener_objeto_del_tenant(db, Ingrediente, ingrediente_id, empresa_id)


@router.patch("/{ingrediente_id}", response_model=IngredienteSalida)
def actualizar_ingrediente(
    ingrediente_id: int,
    payload: IngredienteActualizar,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    ingrediente = obtener_objeto_del_tenant(
        db, Ingrediente, ingrediente_id, empresa_id
    )

    datos = payload.model_dump(exclude_unset=True)
    for campo, valor in datos.items():
        setattr(ingrediente, campo, valor)

    # Si cambiaron pesos, recalculamos merma.
    if "peso_bruto" in datos or "peso_neto" in datos:
        ingrediente.merma_porcentaje = calcular_merma_porcentaje(
            ingrediente.peso_bruto or 0,
            ingrediente.peso_neto or 0,
        )

    db.add(ingrediente)
    db.commit()
    db.refresh(ingrediente)
    return ingrediente


@router.delete("/{ingrediente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(
    ingrediente_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    ingrediente = obtener_objeto_del_tenant(
        db, Ingrediente, ingrediente_id, empresa_id
    )
    db.delete(ingrediente)
    db.commit()
