"""
Guardado y borrado de imagenes en disco, organizado por tenant.

Convenciones:
  - Carpeta base: backend/uploads/
  - Layout: uploads/empresas/{empresa_id}/recetas/{archivo}
  - URL publica: /uploads/empresas/{empresa_id}/recetas/{archivo}
    (montada por main.py via StaticFiles)

Validaciones:
  - Extension permitida: jpg / jpeg / png / webp
  - Content-Type permitido: image/jpeg, image/png, image/webp
  - Peso maximo: 5 MB
"""

from pathlib import Path
from uuid import uuid4
from typing import Optional

from fastapi import HTTPException, UploadFile, status

from app.core.config import MAX_UPLOAD_BYTES, MAX_UPLOAD_MB


# backend/app/services/imagen_service.py -> backend/
BASE_DIR = Path(__file__).resolve().parents[2]
UPLOADS_DIR = BASE_DIR / "uploads"

EXTENSIONES_PERMITIDAS = {".jpg", ".jpeg", ".png", ".webp"}
CONTENT_TYPES_PERMITIDOS = {"image/jpeg", "image/png", "image/webp"}


def _validar_archivo(archivo: UploadFile) -> str:
    if archivo.content_type not in CONTENT_TYPES_PERMITIDOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido: {archivo.content_type}",
        )
    extension = Path(archivo.filename or "").suffix.lower()
    if extension not in EXTENSIONES_PERMITIDAS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Extension no permitida: {extension}",
        )
    return extension


def guardar_imagen_receta(
    archivo: UploadFile,
    empresa_id: int,
    receta_id: int,
) -> str:
    """
    Guarda la imagen en disco y devuelve la URL publica (string)
    lista para persistir en `recetas.imagen_url`.
    """
    extension = _validar_archivo(archivo)

    contenido = archivo.file.read()
    if len(contenido) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"La imagen excede el tamano maximo ({MAX_UPLOAD_MB} MB)",
        )

    destino_dir = UPLOADS_DIR / "empresas" / str(empresa_id) / "recetas"
    destino_dir.mkdir(parents=True, exist_ok=True)

    nombre_archivo = f"{receta_id}_{uuid4().hex[:8]}{extension}"
    destino = destino_dir / nombre_archivo
    destino.write_bytes(contenido)

    return f"/uploads/empresas/{empresa_id}/recetas/{nombre_archivo}"


def borrar_imagen_por_url(imagen_url: Optional[str]) -> None:
    """Borra el archivo fisico apuntado por una URL `/uploads/...`."""
    if not imagen_url or not imagen_url.startswith("/uploads/"):
        return
    relativa = imagen_url.lstrip("/").removeprefix("uploads/")
    archivo = UPLOADS_DIR / relativa
    try:
        if archivo.is_file():
            archivo.unlink()
    except OSError:
        # Si no se puede borrar (permisos, etc.), no rompemos la operacion.
        pass
