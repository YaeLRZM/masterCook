from sqlalchemy.orm import Session
from app.models.rol import Rol
from app.models.rol_permiso import RolPermiso
from app.models.permiso import Permiso

def asignar_permiso_a_rol(db: Session, id_rol: int, id_permiso: int):
    relacion = RolPermiso(id_rol=id_rol, id_permiso=id_permiso)
    db.add(relacion)
    db.commit()
    return {"msg": "Permiso asignado al rol"}

def quitar_permiso_de_rol(db: Session, id_rol: int, id_permiso: int):
    db.query(RolPermiso).filter_by(
        id_rol=id_rol,
        id_permiso=id_permiso
    ).delete()
    db.commit()
    return {"msg": "Permiso removido"}

def obtener_permisos_por_rol(db: Session, id_rol: int):
    return db.query(Permiso).join(RolPermiso).filter(
        RolPermiso.id_rol == id_rol
    ).all()

def obtener_roles_con_permisos(db: Session):
    roles = db.query(Rol).all()

    resultado = []

    for rol in roles:
        permisos = db.query(Permiso).join(RolPermiso).filter(
            RolPermiso.id_rol == rol.id_rol
        ).all()

        resultado.append({
            "rol": rol.nombre,
            "permisos": [p.nombre for p in permisos]
        })

    return resultado
