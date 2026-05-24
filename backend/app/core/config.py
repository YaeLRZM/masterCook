"""
Configuracion centralizada. Lee todas las variables de entorno desde .env
y expone constantes con valores por defecto seguros para desarrollo.

Cualquier archivo que necesite un valor de configuracion debe importarlo
de aqui (no llamar a `os.getenv` ni a `load_dotenv` en otros lados).
"""

from dotenv import load_dotenv
import os


load_dotenv()


def _requerido(nombre: str) -> str:
    valor = os.getenv(nombre)
    if not valor:
        raise RuntimeError(
            f"Falta la variable de entorno obligatoria '{nombre}'. "
            "Definela en backend/.env"
        )
    return valor


def _entero(nombre: str, default: int) -> int:
    valor = os.getenv(nombre)
    if valor is None or valor == "":
        return default
    try:
        return int(valor)
    except ValueError:
        raise RuntimeError(
            f"La variable '{nombre}' debe ser un entero, se recibio: {valor!r}"
        )


def _lista_csv(nombre: str, default: list[str]) -> list[str]:
    valor = os.getenv(nombre)
    if not valor:
        return default
    return [item.strip() for item in valor.split(",") if item.strip()]


# --- Base de datos --------------------------------------------------------
DATABASE_URL: str = _requerido("DATABASE_URL")

# --- Seguridad / JWT ------------------------------------------------------
SECRET_KEY: str = _requerido("SECRET_KEY")
ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = _entero("ACCESS_TOKEN_EXPIRE_MINUTES", 60)

# --- CORS -----------------------------------------------------------------
CORS_ORIGINS: list[str] = _lista_csv(
    "CORS_ORIGINS",
    default=["http://localhost:3000"],
)

# --- Uploads --------------------------------------------------------------
MAX_UPLOAD_MB: int = _entero("MAX_UPLOAD_MB", 5)
MAX_UPLOAD_BYTES: int = MAX_UPLOAD_MB * 1024 * 1024
