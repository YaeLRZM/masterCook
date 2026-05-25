"""
Script para crear los roles globales en la base de datos.
Ejecutar después de hacer las migraciones de Alembic.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, insert

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def seed_roles():
    """Crea los roles globales si no existen."""
    ROLES_GLOBALES = [
        ("SUPER_ADMIN", "Administrador del sistema"),
        ("ADMIN", "Administrador de empresa"),
        ("CHEF", "Chef"),
        ("AYUDANTE_CHEF", "Ayudante de Chef"),
        ("VENDEDOR", "Vendedor de eventos"),
    ]

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        for nombre, descripcion in ROLES_GLOBALES:
            # Verificar si existe
            resultado = conn.execute(
                text("SELECT id FROM roles WHERE nombre = :nombre"),
                {"nombre": nombre}
            ).scalar()

            if resultado:
                print(f"[OK] Rol '{nombre}' ya existe")
            else:
                conn.execute(
                    text("INSERT INTO roles (nombre, descripcion) VALUES (:nombre, :descripcion)"),
                    {"nombre": nombre, "descripcion": descripcion}
                )
                print(f"[OK] Creando rol '{nombre}'...")

        conn.commit()
        print("\n[OK] Roles globales inicializados correctamente")

if __name__ == "__main__":
    seed_roles()
