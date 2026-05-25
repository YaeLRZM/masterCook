"""
Seed inicial de MasterCook.

Crea (idempotente: se puede correr varias veces sin duplicar):
  - Empresa "Sistema"  -> alberga al super-admin global.
  - Empresa demo "Catering Demo"  -> ejemplo de tenant real.
  - Roles por defecto:
        Sistema: SUPER_ADMIN
        Demo:    ADMIN, CHEF, OPERADOR
  - Usuario super-admin global:  admin@mastercook.com / admin123
  - Catalogo basico de unidades de medida + conversiones (kg<->g, l<->ml).

Como correrlo:
    cd backend
    .\\venv\\Scripts\\python.exe scripts\\seed.py
"""

import sys
from pathlib import Path

# Permite ejecutar el script desde cualquier lado: agrega backend/ al sys.path
# para que `import app...` funcione.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402
from sqlalchemy.orm import Session  # noqa: E402

from app.core.security import hashear_password  # noqa: E402
from app.database import base  # noqa: E402, F401  registra todos los modelos
from app.database.database import SessionLocal  # noqa: E402

from app.models.conversion_unidad import ConversionUnidad  # noqa: E402
from app.models.empresa import Empresa  # noqa: E402
from app.models.persona import Persona  # noqa: E402
from app.models.rol import Rol  # noqa: E402
from app.models.unidad_medida import UnidadMedida  # noqa: E402
from app.models.usuario import Usuario  # noqa: E402
from app.models.usuario_rol import UsuarioRol  # noqa: E402


SUPER_ADMIN_EMAIL = "admin@mastercook.com"
SUPER_ADMIN_PASSWORD = "admin123"


def get_or_create(db: Session, modelo, defaults: dict | None = None, **lookup):
    """Busca una fila por `lookup`. Si no existe la crea con `lookup + defaults`."""
    instancia = db.execute(
        select(modelo).filter_by(**lookup)
    ).scalar_one_or_none()
    if instancia is not None:
        return instancia, False
    datos = {**lookup, **(defaults or {})}
    instancia = modelo(**datos)
    db.add(instancia)
    db.flush()
    return instancia, True


# --- Empresas --------------------------------------------------------------

def seed_empresas(db: Session) -> tuple[Empresa, Empresa]:
    sistema, creada_s = get_or_create(
        db,
        Empresa,
        email="sistema@mastercook.dev",
        defaults=dict(
            nombre="Sistema",
            telefono="0000000000",
            direccion="Sistema interno",
            rfc="SYS010101XXX",
            estatus="ACTIVA",
            activa=True,
        ),
    )
    demo, creada_d = get_or_create(
        db,
        Empresa,
        email="demo@mastercook.dev",
        defaults=dict(
            nombre="Catering Demo",
            telefono="5555555555",
            direccion="Av. Demo 123",
            rfc="DEMO010101XYZ",
            estatus="ACTIVA",
            activa=True,
        ),
    )
    print(f"  Empresa 'Sistema'        id={sistema.id}  {'[nueva]' if creada_s else '[ya existia]'}")
    print(f"  Empresa 'Catering Demo'  id={demo.id}  {'[nueva]' if creada_d else '[ya existia]'}")
    return sistema, demo


# --- Roles -----------------------------------------------------------------

def seed_roles(db: Session, empresa: Empresa, nombres: list[str]) -> dict[str, Rol]:
    creados: dict[str, Rol] = {}
    for nombre in nombres:
        rol, nuevo = get_or_create(
            db,
            Rol,
            empresa_id=empresa.id,
            nombre=nombre,
            defaults={"descripcion": f"Rol {nombre} por defecto"},
        )
        creados[nombre] = rol
        marca = "[nuevo]" if nuevo else "[ya existia]"
        print(f"  Rol {nombre:<12} empresa_id={empresa.id}  {marca}")
    return creados


# --- Super admin -----------------------------------------------------------

def seed_super_admin(db: Session, empresa_sistema: Empresa, rol_super_admin: Rol) -> Usuario:
    persona, _ = get_or_create(
        db,
        Persona,
        nombre="Admin",
        apellido_paterno="Global",
        defaults={"telefono": "0000000000"},
    )

    usuario, nuevo = get_or_create(
        db,
        Usuario,
        email=SUPER_ADMIN_EMAIL,
        defaults=dict(
            nombre_login="admin",
            password_hash=hashear_password(SUPER_ADMIN_PASSWORD),
            empresa_id=empresa_sistema.id,
            persona_id=persona.id,
            estatus="ACTIVO",
            activo=True,
        ),
    )

    # Asegura la asignacion del rol SUPER_ADMIN.
    asignacion = db.execute(
        select(UsuarioRol).filter_by(
            usuario_id=usuario.id,
            rol_id=rol_super_admin.id,
        )
    ).scalar_one_or_none()
    if asignacion is None:
        db.add(UsuarioRol(usuario_id=usuario.id, rol_id=rol_super_admin.id))

    marca = "[nuevo]" if nuevo else "[ya existia]"
    print(f"  Usuario {SUPER_ADMIN_EMAIL} id={usuario.id}  rol=SUPER_ADMIN  {marca}")
    return usuario


# --- Unidades + conversiones ----------------------------------------------

def seed_unidades(db: Session) -> dict[str, UnidadMedida]:
    catalogo = [
        ("Kilogramo", "kg"),
        ("Gramo", "g"),
        ("Litro", "l"),
        ("Mililitro", "ml"),
        ("Pieza", "pz"),
    ]
    unidades: dict[str, UnidadMedida] = {}
    for nombre, abreviatura in catalogo:
        u, nuevo = get_or_create(
            db,
            UnidadMedida,
            abreviatura=abreviatura,
            defaults={"nombre": nombre},
        )
        unidades[abreviatura] = u
        marca = "[nueva]" if nuevo else "[ya existia]"
        print(f"  Unidad {nombre:<10} ({abreviatura})  id={u.id}  {marca}")
    return unidades


def seed_conversiones(db: Session, unidades: dict[str, UnidadMedida]) -> None:
    pares = [
        ("kg", "g", 1000.0),
        ("l", "ml", 1000.0),
    ]
    for origen, destino, factor in pares:
        u_origen = unidades[origen]
        u_destino = unidades[destino]
        existente = db.execute(
            select(ConversionUnidad).filter_by(
                unidad_origen_id=u_origen.id,
                unidad_destino_id=u_destino.id,
            )
        ).scalar_one_or_none()
        if existente is None:
            db.add(ConversionUnidad(
                unidad_origen_id=u_origen.id,
                unidad_destino_id=u_destino.id,
                factor_multiplicador=factor,
            ))
            print(f"  Conversion {origen} -> {destino} = {factor}  [nueva]")
        else:
            print(f"  Conversion {origen} -> {destino}  [ya existia]")


# --- Entrypoint ------------------------------------------------------------

def main() -> None:
    db = SessionLocal()
    try:
        print("\n== Empresas ==")
        sistema, _demo = seed_empresas(db)
        db.flush()

        print("\n== Roles de la empresa Sistema ==")
        roles_sistema = seed_roles(db, sistema, ["SUPER_ADMIN"])

        print("\n== Roles de la empresa Demo ==")
        # Nombres alineados con el enum Role del frontend
        # (SUPER_ADMIN, ADMIN, CHEF, AUXILIAR, SALES).
        seed_roles(db, _demo, ["ADMIN", "CHEF", "AUXILIAR", "SALES"])

        print("\n== Super-admin global ==")
        seed_super_admin(db, sistema, roles_sistema["SUPER_ADMIN"])

        print("\n== Unidades de medida ==")
        unidades = seed_unidades(db)

        print("\n== Conversiones ==")
        seed_conversiones(db, unidades)

        db.commit()

        print("\n[OK] Seed completado.\n")
        print("Login del super-admin:")
        print(f"  email:    {SUPER_ADMIN_EMAIL}")
        print(f"  password: {SUPER_ADMIN_PASSWORD}")
        print("Cambia el password despues del primer login!\n")
    except Exception as exc:
        db.rollback()
        print(f"\n[ERROR] Seed fallo: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
