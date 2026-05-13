from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.models.user import User

from app.schemas.user_schema import (
    UserCreate,
    UserLogin
)

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# =========================
# DATABASE SESSION
# =========================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================
# REGISTER
# =========================

@router.post("/register")

def register(user: UserCreate):

    db: Session = SessionLocal()

    # HASH PASSWORD

    hashed_password = hash_password(
        user.password
    )

    # CREATE USER

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        company_id=user.company_id
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role,
            "company_id": new_user.company_id
        }
    }


# =========================
# LOGIN
# =========================

@router.post("/login")

def login(data: UserLogin):

    db: Session = SessionLocal()

    # FIND USER

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    # VALIDATE USER

    if not user:
        return {
            "error": "Invalid credentials"
        }

    # VALIDATE PASSWORD

    valid_password = verify_password(
        data.password,
        user.password
    )

    if not valid_password:
        return {
            "error": "Invalid credentials"
        }

    # CREATE JWT TOKEN

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    # RESPONSE

    return {
    "token": token,
    "user": {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company_id": user.company_id
    }
}