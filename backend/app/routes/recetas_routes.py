"""
CRUD de Recetas con calculo dinamico de costo y aislamiento multi-tenant.
"""

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_empresa_actual_id,
    obtener_objeto_del_tenant,
    obtener_usuario_actual,
)
from app.models.receta import Receta
from app.models.receta_ingrediente import RecetaIngrediente
from app.models.ingrediente import Ingrediente
from app.models.usuario import Usuario
from app.schemas.receta_schema import (
    RecetaCrear,
    RecetaActualizar,
    RecetaSalida,
)
from app.services.receta_service import calcular_costo_receta
from app.services.imagen_service import (
    borrar_imagen_por_url,
    guardar_imagen_receta,
)


router = APIRouter(prefix="/recetas", tags=["Recetas"])


@router.options("/")
@router.options("/{receta_id}")
@router.options("/{receta_id}/imagen")
@router.options("/{receta_id}/recalcular-costo")
def options_handler():
    return {}


def _validar_ingredientes_del_tenant(
    db: Session,
    ingrediente_ids: List[int],
    empresa_id: int,
):
    if not ingrediente_ids:
        return
    encontrados = db.execute(
        select(Ingrediente.id).where(
            Ingrediente.id.in_(ingrediente_ids),
            Ingrediente.empresa_id == empresa_id,
        )
    ).scalars().all()
    if len(encontrados) != len(set(ingrediente_ids)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uno o mas ingredientes no pertenecen a tu empresa",
        )


@router.get("/", response_model=List[RecetaSalida])
def listar_recetas(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return db.execute(
        select(Receta).where(Receta.empresa_id == empresa_id)
    ).scalars().all()


@router.post(
    "/",
    response_model=RecetaSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_receta(
    payload: RecetaCrear,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
    usuario: Usuario = Depends(obtener_usuario_actual),
):
    _validar_ingredientes_del_tenant(
        db, [d.ingrediente_id for d in payload.ingredientes], empresa_id
    )

    receta = Receta(
        empresa_id=empresa_id,
        creado_por=usuario.id,
        nombre=payload.nombre,
        procedimiento=payload.procedimiento,
        rendimiento_porciones=payload.rendimiento_porciones,
        es_subreceta=payload.es_subreceta,
    )
    db.add(receta)
    db.flush()  # necesario para tener receta.id antes de insertar detalles

    for detalle in payload.ingredientes:
        db.add(RecetaIngrediente(
            receta_id=receta.id,
            ingrediente_id=detalle.ingrediente_id,
            unidad_medida_id=detalle.unidad_medida_id,
            cantidad=detalle.cantidad,
        ))

    db.commit()
    db.refresh(receta)

    calcular_costo_receta(db, receta, persistir=True)
    db.refresh(receta)
    return receta


@router.get("/{receta_id}", response_model=RecetaSalida)
def obtener_receta(
    receta_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)


@router.patch("/{receta_id}", response_model=RecetaSalida)
def actualizar_receta(
    receta_id: int,
    payload: RecetaActualizar,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)

    datos = payload.model_dump(exclude_unset=True)
    nuevos_detalles = datos.pop("ingredientes", None)

    for campo, valor in datos.items():
        setattr(receta, campo, valor)

    if nuevos_detalles is not None:
        _validar_ingredientes_del_tenant(
            db, [d["ingrediente_id"] for d in nuevos_detalles], empresa_id
        )
        # Reemplazo total de la lista de ingredientes.
        for viejo in list(receta.ingredientes):
            db.delete(viejo)
        db.flush()
        for d in nuevos_detalles:
            db.add(RecetaIngrediente(
                receta_id=receta.id,
                ingrediente_id=d["ingrediente_id"],
                unidad_medida_id=d["unidad_medida_id"],
                cantidad=d["cantidad"],
            ))

    db.commit()
    db.refresh(receta)
    calcular_costo_receta(db, receta, persistir=True)
    db.refresh(receta)
    return receta


@router.post("/{receta_id}/recalcular-costo", response_model=RecetaSalida)
def recalcular_costo_endpoint(
    receta_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)
    calcular_costo_receta(db, receta, persistir=True)
    db.refresh(receta)
    return receta


@router.delete("/{receta_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_receta(
    receta_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)
    borrar_imagen_por_url(receta.imagen_url)
    db.delete(receta)
    db.commit()


@router.get("/{receta_id}/detalles")
def obtener_detalles_receta(
    receta_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    """Devuelve detalles completos de la receta con desglose de costos por ingrediente."""
    from app.services.conversion_service import obtener_factor_conversion
    from app.services.receta_service import _costo_efectivo_por_unidad
    from app.models.unidad_medida import UnidadMedida

    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)

    detalles_ingredientes = db.execute(
        select(RecetaIngrediente).where(RecetaIngrediente.receta_id == receta.id)
    ).scalars().all()

    ingredientes_desglose = []
    for detalle in detalles_ingredientes:
        ingrediente = db.execute(
            select(Ingrediente).where(
                Ingrediente.id == detalle.ingrediente_id,
                Ingrediente.empresa_id == empresa_id,
            )
        ).scalar_one_or_none()

        if ingrediente is None:
            continue

        # Obtener nombre de la unidad de medida
        unidad_obj = db.execute(
            select(UnidadMedida).where(UnidadMedida.id == detalle.unidad_medida_id)
        ).scalar_one_or_none()
        unidad_nombre = unidad_obj.nombre if unidad_obj else "unidad"

        # Calcular costo
        try:
            factor = obtener_factor_conversion(
                db,
                detalle.unidad_medida_id,
                ingrediente.unidad_medida_id,
            )
        except ValueError:
            factor = 1.0

        cantidad_normalizada = detalle.cantidad * factor
        costo_unitario = _costo_efectivo_por_unidad(
            ingrediente.costo_base,
            ingrediente.merma_porcentaje,
        )
        subtotal = cantidad_normalizada * costo_unitario

        ingredientes_desglose.append({
            "ingrediente_id": ingrediente.id,
            "nombre": ingrediente.nombre,
            "cantidad": detalle.cantidad,
            "unidad_medida": unidad_nombre,
            "costo_base": ingrediente.costo_base,
            "merma_porcentaje": ingrediente.merma_porcentaje,
            "costo_unitario_efectivo": round(costo_unitario, 4),
            "subtotal": round(subtotal, 4),
        })

    return {
        "id": receta.id,
        "nombre": receta.nombre,
        "procedimiento": receta.procedimiento,
        "rendimiento_porciones": receta.rendimiento_porciones,
        "imagen_url": receta.imagen_url,
        "es_subreceta": receta.es_subreceta,
        "costo_total_calculado": receta.costo_total_calculado,
        "ingredientes": ingredientes_desglose,
    }


@router.post("/{receta_id}/imagen", response_model=RecetaSalida)
def subir_imagen_receta(
    receta_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    """Sube/reemplaza la imagen de una receta o subreceta."""
    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)

    # Si ya tenia imagen, la borramos para no dejar archivos huerfanos.
    borrar_imagen_por_url(receta.imagen_url)

    receta.imagen_url = guardar_imagen_receta(
        archivo=archivo,
        empresa_id=empresa_id,
        receta_id=receta.id,
    )
    db.add(receta)
    db.commit()
    db.refresh(receta)
    return receta


@router.delete("/{receta_id}/imagen", response_model=RecetaSalida)
def quitar_imagen_receta(
    receta_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    receta = obtener_objeto_del_tenant(db, Receta, receta_id, empresa_id)
    if not receta.imagen_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La receta no tiene imagen",
        )
    borrar_imagen_por_url(receta.imagen_url)
    receta.imagen_url = None
    db.add(receta)
    db.commit()
    db.refresh(receta)
    return receta
