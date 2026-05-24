"""
Gestion del catalogo de Empresas (tenants). Solo SUPER_ADMIN.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database.database import get_db
from app.dependencies.autenticacion import requiere_roles
from app.models.empresa import Empresa
from app.schemas.empresa_schema import (
    EmpresaCrear,
    EmpresaActualizar,
    EmpresaSalida,
)


router = APIRouter(prefix="/empresas", tags=["Empresas"])


@router.get("/", response_model=List[EmpresaSalida])
def listar_empresas(
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    return db.execute(select(Empresa)).scalars().all()


@router.post(
    "/",
    response_model=EmpresaSalida,
    status_code=status.HTTP_201_CREATED,
)
def crear_empresa(
    payload: EmpresaCrear,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    duplicado = db.execute(
        select(Empresa).where(Empresa.email == payload.email)
    ).scalar_one_or_none()
    if duplicado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email de empresa ya registrado",
        )
    nueva = Empresa(**payload.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.patch("/{empresa_id}", response_model=EmpresaSalida)
def actualizar_empresa(
    empresa_id: int,
    payload: EmpresaActualizar,
    db: Session = Depends(get_db),
    _=Depends(requiere_roles(["SUPER_ADMIN"])),
):
    empresa = db.execute(
        select(Empresa).where(Empresa.id == empresa_id)
    ).scalar_one_or_none()
    if empresa is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada",
        )
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(empresa, campo, valor)
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa
