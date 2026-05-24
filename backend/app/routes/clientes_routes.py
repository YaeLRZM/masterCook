from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import (
    obtener_empresa_actual_id,
    obtener_objeto_del_tenant,
)
from app.models.cliente import Cliente
from app.schemas.cliente_schema import (
    ClienteCrear,
    ClienteActualizar,
    ClienteSalida,
)


router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("/", response_model=List[ClienteSalida])
def listar_clientes(
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return db.execute(
        select(Cliente).where(Cliente.empresa_id == empresa_id)
    ).scalars().all()


@router.post(
    "/",
    response_model=ClienteSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_cliente(
    payload: ClienteCrear,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    nuevo = Cliente(
        empresa_id=empresa_id,  # asignacion del tenant
        persona_id=payload.persona_id,
        rfc=payload.rfc,
        razon_social=payload.razon_social,
        email=payload.email,
        telefono=payload.telefono,
        direccion=payload.direccion,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{cliente_id}", response_model=ClienteSalida)
def obtener_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    return obtener_objeto_del_tenant(db, Cliente, cliente_id, empresa_id)


@router.patch("/{cliente_id}", response_model=ClienteSalida)
def actualizar_cliente(
    cliente_id: int,
    payload: ClienteActualizar,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    cliente = obtener_objeto_del_tenant(db, Cliente, cliente_id, empresa_id)
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(cliente, campo, valor)
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db),
    empresa_id: int = Depends(obtener_empresa_actual_id),
):
    cliente = obtener_objeto_del_tenant(db, Cliente, cliente_id, empresa_id)
    db.delete(cliente)
    db.commit()
