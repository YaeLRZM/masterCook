from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.database import get_db

from app.models.user import User
from app.models.company import Company

from app.schemas.user_schema import UserCreate

from app.dependencies.roles import role_required

from app.core.security import hash_password

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/admins")
def get_admins(
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["SUPER_ADMIN"])
    )
):
    users = db.execute(
        select(User).where(
            User.role == "ADMIN"
        )
    ).scalars().all()

    result = []

    for user in users:
        company = db.execute(
            select(Company).where(
                Company.id == user.company_id
            )
        ).scalar_one_or_none()

        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "status": (
                "ACTIVE"
                if user.is_active
                else "INACTIVE"
            ),
            "company": (
                company.name
                if company
                else "No company"
            )
        })

    return result


@router.post("/admins")
def create_admin(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        role_required(["SUPER_ADMIN"])
    )
):
    existing_user = db.execute(
        select(User).where(
            User.email == user.email
        )
    ).scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    company = db.execute(
        select(Company).where(
            Company.id == user.company_id
        )
    ).scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(
            user.password
        ),
        role="ADMIN",
        company_id=user.company_id,
        is_active=True
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "Admin created"
    }