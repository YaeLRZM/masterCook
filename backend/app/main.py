from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import CORS_ORIGINS
from app.database.database import engine
from app.database.base import Base


class CORSHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        if origin in CORS_ORIGINS:
            response = await call_next(request)
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = request.headers.get("access-control-request-headers", "*")
            return response
        return await call_next(request)

from app.routes.auth_routes import router as auth_router
from app.routes.empresas_routes import router as empresas_router
from app.routes.usuarios_routes import router as usuarios_router
from app.routes.clientes_routes import router as clientes_router
from app.routes.unidades_routes import router as unidades_router
from app.routes.ingredientes_routes import router as ingredientes_router
from app.routes.recetas_routes import router as recetas_router
from app.routes.cotizaciones_routes import router as cotizaciones_router


app = FastAPI(title="MasterCook API", version="1.0.0")

app.add_middleware(CORSHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Crea las tablas del nuevo esquema (en desarrollo).
Base.metadata.create_all(bind=engine)

# Sirve archivos subidos (imagenes de recetas, etc.) en /uploads/...
UPLOADS_DIR = Path(__file__).resolve().parents[1] / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

app.include_router(auth_router)
app.include_router(empresas_router)
app.include_router(usuarios_router)
app.include_router(clientes_router)
app.include_router(unidades_router)
app.include_router(ingredientes_router)
app.include_router(recetas_router)
app.include_router(cotizaciones_router)


@app.get("/")
def root():
    return {"message": "MasterCook API"}
