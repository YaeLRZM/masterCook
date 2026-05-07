from sqlalchemy.orm import Session
from app.models.rol import Rol

def obtener_roles(db: Session):
    return db.query(Rol).all()

def crear_rol(db: Session, nombre: str, descripcion: str | None):
    existe = db.query(Rol).filter_by(nombre=nombre).first()
    if existe:
        raise ValueError("El rol ya existe")

    rol = Rol(nombre=nombre, descripcion=descripcion)
    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol

def actualizar_rol(db: Session, id_rol: int, nombre: str, descripcion: str | None):
    rol = db.query(Rol).get(id_rol)
    if not rol:
        raise ValueError("Rol no encontrado")

    rol.nombre = nombre
    rol.descripcion = descripcion
    db.commit()
    db.refresh(rol)
    return rol

def eliminar_rol(db: Session, id_rol: int):
    rol = db.query(Rol).get(id_rol)
    if not rol:
        raise ValueError("Rol no encontrado")

    db.delete(rol)
    db.commit()
    return {"msg": "Rol eliminado"}
