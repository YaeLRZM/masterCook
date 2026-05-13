from fastapi import APIRouter, Depends

from app.dependencies.roles import role_required

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    current_user = Depends(
        role_required(["ADMIN"])
    )
):

    return {
        "message": "Welcome Admin",
        "user": current_user.email
    }