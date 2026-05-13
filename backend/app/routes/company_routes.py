from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.database import get_db
from app.models.company import Company
from app.schemas.company_schema import CompanyCreate
from app.dependencies.roles import role_required

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.get("/")
def get_companies(
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["SUPER_ADMIN"]))
):
    companies = db.execute(
        select(Company)
    ).scalars().all()

    return companies


@router.post("/")
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["SUPER_ADMIN"]))
):
    existing_company = db.execute(
        select(Company).where(
            Company.email == company.email
        )
    ).scalar_one_or_none()

    if existing_company:
        raise HTTPException(
            status_code=400,
            detail="Company email already exists"
        )

    new_company = Company(
        name=company.name,
        email=company.email,
        phone=company.phone,
        address=company.address,
        is_active=True,
        status="ACTIVE"
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return {
        "message": "Company created",
        "company": new_company
    }


@router.patch("/{company_id}/toggle-status")
def toggle_company_status(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["SUPER_ADMIN"]))
):
    company = db.execute(
        select(Company).where(
            Company.id == company_id
        )
    ).scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    if company.status == "INACTIVE":
        raise HTTPException(
            status_code=400,
            detail="Inactive companies cannot be reactivated from suspend action"
        )

    if company.status == "ACTIVE":
        company.status = "SUSPENDED"
        company.is_active = False
    else:
        company.status = "ACTIVE"
        company.is_active = True

    db.commit()
    db.refresh(company)

    return {
        "message": "Company status updated",
        "company": company
    }


@router.patch("/{company_id}/deactivate")
def deactivate_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(role_required(["SUPER_ADMIN"]))
):
    company = db.execute(
        select(Company).where(
            Company.id == company_id
        )
    ).scalar_one_or_none()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    company.status = "INACTIVE"
    company.is_active = False

    db.commit()
    db.refresh(company)

    return {
        "message": "Company deactivated",
        "company": company
    }