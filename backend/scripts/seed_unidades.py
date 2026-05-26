#!/usr/bin/env python3
"""
Script para insertar unidades de medida comunes en la BD.
"""

import sys
from pathlib import Path

# Agregar el directorio padre al path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database.database import SessionLocal
from app.models.unidad_medida import UnidadMedida
# Importar todos los modelos para evitar errores de relación
from app.models.conversion_unidad import ConversionUnidad

# Unidades comunes en cocina
UNIDADES = [
    {"nombre": "Kilogramo", "abreviatura": "kg"},
    {"nombre": "Gramo", "abreviatura": "g"},
    {"nombre": "Litro", "abreviatura": "L"},
    {"nombre": "Mililitro", "abreviatura": "ml"},
    {"nombre": "Pieza", "abreviatura": "pz"},
    {"nombre": "Docena", "abreviatura": "doc"},
    {"nombre": "Taza", "abreviatura": "tza"},
    {"nombre": "Cucharada", "abreviatura": "cda"},
    {"nombre": "Cucharadita", "abreviatura": "cdta"},
    {"nombre": "Paquete", "abreviatura": "paq"},
    {"nombre": "Bolsa", "abreviatura": "bolsa"},
    {"nombre": "Botella", "abreviatura": "bot"},
    {"nombre": "Lata", "abreviatura": "lata"},
    {"nombre": "Bote", "abreviatura": "bote"},
    {"nombre": "Caja", "abreviatura": "caja"},
]

def main():
    db = SessionLocal()
    try:
        # Verificar si ya existen unidades
        existing = db.query(UnidadMedida).count()
        if existing > 0:
            print(f"Ya existen {existing} unidades de medida en la BD. Saltando insercion.")
            return

        # Insertar unidades
        for u in UNIDADES:
            unidad = UnidadMedida(
                nombre=u["nombre"],
                abreviatura=u["abreviatura"]
            )
            db.add(unidad)

        db.commit()
        print(f"[OK] {len(UNIDADES)} unidades de medida insertadas correctamente")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error al insertar unidades: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    main()
