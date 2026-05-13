from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/test",
    tags=["Test"]
)


@router.get("/private")
def private_route(
    current_user = Depends(get_current_user)
):

    return {
        "message": "Ruta privada",
        "user": current_user.email,
        "role": current_user.role
    }