from fastapi import FastAPI

from app.database.database import engine
from app.database.base import Base

from app.routes.auth_routes import router as auth_router
from app.routes.company_routes import router as company_router

from app.routes.test_routes import router as test_router
from app.routes.admin_routes import router as admin_router
from app.routes.chef_routes import router as chef_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.users_routes import router as user_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(company_router)
app.include_router(test_router)
app.include_router(admin_router)
app.include_router(chef_router)
app.include_router(user_router)

@app.get("/")
def root():
    return {
        "message": "MasterCook API"
    }