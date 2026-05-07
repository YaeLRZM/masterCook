from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.database.base import Base
from app.models.persona import Persona
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.models.permiso import Permiso
from app.models.usuario_rol import UsuarioRol
from app.models.rol_permiso import RolPermiso

from app.routes import auth_routes
from app.routes import usuarios_routes
from app.routes import rol_routes
from app.routes import permisos_routes
from app.routes import roles_permisos_routes
from app.routes import usuario_roles_route

app = FastAPI(title="MasterCook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(usuarios_routes.router)
app.include_router(rol_routes.router)
app.include_router(permisos_routes.router)
app.include_router(roles_permisos_routes.router)
app.include_router(usuario_roles_route.router)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("Base de datos lista")

@app.get("/")
def root():
    return {"message": "MasterCook API funcionando"}
