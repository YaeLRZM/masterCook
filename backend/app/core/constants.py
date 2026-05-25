"""
Constantes de dominio compartidas por toda la app.
"""

# Nombres de rol que NO pueden ser creados, asignados ni revocados por un
# ADMIN de empresa. Solo el SUPER_ADMIN del sistema toca estos.
ROLES_RESERVADOS: set[str] = {"ADMIN", "SUPER_ADMIN"}

ROL_SUPER_ADMIN = "SUPER_ADMIN"
ROL_ADMIN = "ADMIN"
ROL_CHEF = "CHEF"
ROL_AYUDANTE_CHEF = "AYUDANTE_CHEF"
ROL_VENDEDOR = "VENDEDOR"

# Roles globales del sistema (predefinidos)
ROLES_GLOBALES = [
    ("SUPER_ADMIN", "Administrador del sistema"),
    ("ADMIN", "Administrador de empresa"),
    ("CHEF", "Chef"),
    ("AYUDANTE_CHEF", "Ayudante de Chef"),
    ("VENDEDOR", "Vendedor de eventos"),
]
