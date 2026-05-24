from passlib.context import CryptContext

from jose import jwt

from datetime import datetime, timedelta
from typing import Optional

from app.core.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
)


pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
)


def hashear_password(password: str) -> str:
    return pwd_context.hash(password)


def verificar_password(password_plano: str, password_hasheada: str) -> bool:
    return pwd_context.verify(password_plano, password_hasheada)


def crear_access_token(
    sub: str,
    empresa_id: Optional[int],
    usuario_id: int,
    roles: Optional[list] = None,
    expira_en_minutos: int = ACCESS_TOKEN_EXPIRE_MINUTES,
) -> str:
    """
    Construye el JWT inyectando empresa_id para garantizar el aislamiento
    multi-tenant en todas las consultas subsecuentes.
    """
    payload = {
        "sub": sub,                  # email del usuario
        "usuario_id": usuario_id,
        "empresa_id": empresa_id,    # <- clave del tenant
        "roles": roles or [],
        "exp": datetime.utcnow() + timedelta(minutes=expira_en_minutos),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
