"""
Script para inicializar la base de datos desde cero.
Ejecuta las migraciones, crea los roles, y el usuario SUPER_ADMIN default.

Uso: python scripts/init_db.py
"""
import os
import sys
import subprocess
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

def run_command(cmd, description):
    """Ejecuta un comando y reporta el resultado."""
    print(f"\n{'='*60}")
    print(f"▶ {description}")
    print(f"{'='*60}")
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"❌ Error ejecutando: {description}")
        sys.exit(1)
    print(f"✓ {description} completado")

def seed_roles():
    """Crea los roles globales si no existen."""
    from app.core.constants import ROLES_GLOBALES

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        print("\n▶ Creando roles globales...")
        for nombre, descripcion in ROLES_GLOBALES:
            resultado = conn.execute(
                text("SELECT id FROM roles WHERE nombre = :nombre"),
                {"nombre": nombre}
            ).scalar()

            if resultado:
                print(f"  ✓ Rol '{nombre}' ya existe")
            else:
                conn.execute(
                    text("INSERT INTO roles (nombre, descripcion) VALUES (:nombre, :descripcion)"),
                    {"nombre": nombre, "descripcion": descripcion}
                )
                print(f"  ✓ Creando rol '{nombre}'...")

        conn.commit()
    print("✓ Roles globales creados exitosamente")

def create_default_super_admin():
    """Crea el usuario SUPER_ADMIN default."""
    from app.core.security import hashear_password

    engine = create_engine(DATABASE_URL)
    password_hash = hashear_password('Admin@123')

    with engine.connect() as conn:
        print("\n▶ Creando usuario SUPER_ADMIN default...")

        # Verificar si ya existe
        existing_user = conn.execute(
            text("SELECT id FROM usuarios WHERE email = :email"),
            {"email": "admin@mastercook.com"}
        ).scalar()

        if existing_user:
            print("  ✓ Usuario SUPER_ADMIN ya existe")
            conn.commit()
            return

        # Crear empresa default
        conn.execute(text('''
            INSERT INTO empresas (nombre, email, telefono, direccion, estatus, activa)
            VALUES ('MasterCook Admin', 'admin@mastercook.com', '+1234567890', 'Central', 'ACTIVA', true)
        '''))

        # Obtener el ID de la empresa
        empresa_id = conn.execute(
            text('SELECT id FROM empresas WHERE email = :email'),
            {"email": "admin@mastercook.com"}
        ).scalar()

        # Crear usuario SUPER_ADMIN
        conn.execute(text('''
            INSERT INTO usuarios (empresa_id, nombre_login, email, password_hash, estatus, activo)
            VALUES (:empresa_id, :nombre_login, :email, :password_hash, :estatus, :activo)
        '''), {
            'empresa_id': empresa_id,
            'nombre_login': 'admin',
            'email': 'admin@mastercook.com',
            'password_hash': password_hash,
            'estatus': 'ACTIVO',
            'activo': True
        })

        # Obtener IDs necesarios
        usuario_id = conn.execute(
            text('SELECT id FROM usuarios WHERE email = :email'),
            {"email": "admin@mastercook.com"}
        ).scalar()
        rol_id = conn.execute(
            text('SELECT id FROM roles WHERE nombre = :nombre'),
            {"nombre": "SUPER_ADMIN"}
        ).scalar()

        # Asignar rol SUPER_ADMIN
        conn.execute(text('''
            INSERT INTO usuarios_roles (usuario_id, rol_id)
            VALUES (:usuario_id, :rol_id)
        '''), {
            'usuario_id': usuario_id,
            'rol_id': rol_id
        })

        conn.commit()

    print("✓ Usuario SUPER_ADMIN creado exitosamente")
    print("\n  Email: admin@mastercook.com")
    print("  Password: Admin@123")
    print("  Rol: SUPER_ADMIN")

def main():
    print("\n" + "="*60)
    print("INICIALIZACION DE BASE DE DATOS - MasterCook")
    print("="*60)

    # 1. Ejecutar migraciones
    run_command(
        "alembic upgrade head",
        "Ejecutando migraciones de Alembic"
    )

    # 2. Crear roles
    seed_roles()

    # 3. Crear usuario default
    create_default_super_admin()

    print("\n" + "="*60)
    print("✓ BASE DE DATOS INICIALIZADA CORRECTAMENTE")
    print("="*60)
    print("\nPuedes iniciar el servidor con:")
    print("  uvicorn app.main:app --reload")
    print("\nO en otra terminal, iniciar el frontend con:")
    print("  npm run dev")
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
