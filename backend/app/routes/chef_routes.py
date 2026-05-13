from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.database import get_db

from app.models.chef import Chef

from app.schemas.chef_schema import (
    ChefCreate,
    ChefResponse
)

from app.dependencies.roles import role_required

router = APIRouter(
    prefix="/chefs",
    tags=["Chefs"]
)


@router.post("/")
def create_chef(
    chef: ChefCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        role_required(["ADMIN"])
    )
):

    new_chef = Chef(
        name=chef.name,
        specialty=chef.specialty,
        phone=chef.phone,
        company_id=chef.company_id
    )

    db.add(new_chef)

    db.commit()

    db.refresh(new_chef)

    return {
        "message": "Chef created",
        "chef": new_chef
    }


@router.get("/")
def get_chefs(
    db: Session = Depends(get_db),
    current_user = Depends(
        role_required(["ADMIN", "CHEF"])
    )
):

    chefs = db.execute(
        select(Chef)
    ).scalars().all()

    return chefs


@router.get("/{chef_id}")
def get_chef(
    chef_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        role_required(["ADMIN", "CHEF"])
    )
):

    chef = db.execute(
        select(Chef).where(
            Chef.id == chef_id
        )
    ).scalar_one_or_none()

    if not chef:

        raise HTTPException(
            status_code=404,
            detail="Chef not found"
        )

    return chef


@router.put("/{chef_id}")
def update_chef(
    chef_id: int,
    data: ChefCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        role_required(["ADMIN"])
    )
):

    chef = db.execute(
        select(Chef).where(
            Chef.id == chef_id
        )
    ).scalar_one_or_none()

    if not chef:

        raise HTTPException(
            status_code=404,
            detail="Chef not found"
        )

    chef.name = data.name
    chef.specialty = data.specialty
    chef.phone = data.phone

    db.commit()

    db.refresh(chef)

    return {
        "message": "Chef updated",
        "chef": chef
    }


@router.delete("/{chef_id}")
def delete_chef(
    chef_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        role_required(["ADMIN"])
    )
):

    chef = db.execute(
        select(Chef).where(
            Chef.id == chef_id
        )
    ).scalar_one_or_none()

    if not chef:

        raise HTTPException(
            status_code=404,
            detail="Chef not found"
        )

    db.delete(chef)

    db.commit()

    return {
        "message": "Chef deleted"
    }