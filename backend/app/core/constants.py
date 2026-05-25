"""
Constantes de dominio compartidas por toda la app.
"""

# Nombres de rol que NO pueden ser creados, asignados ni revocados por un
# ADMIN de empresa. Solo el SUPER_ADMIN del sistema toca estos.
ROLES_RESERVADOS: set[str] = {"ADMIN", "SUPER_ADMIN"}

ROL_SUPER_ADMIN = "SUPER_ADMIN"
ROL_ADMIN = "ADMIN"
