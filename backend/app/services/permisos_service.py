from sqlalchemy.orm import Session
from app.models.permiso import Permiso

def obtener_permisos(db: Session):
    return db.query(Permiso).all()

def crear_permiso(db: Session, nombre, descripcion):
    if db.query(Permiso).filter_by(nombre=nombre).first():
        raise ValueError("Permiso ya existe")

    permiso = Permiso(nombre=nombre, descripcion=descripcion)
    db.add(permiso)
    db.commit()
    db.refresh(permiso)
    return permiso

def actualizar_permiso(db: Session, id_permiso: int, nombre: str, descripcion: str):
    permiso = db.query(Permiso).get(id_permiso)

    if db.query(Permiso).filter(
        Permiso.nombre == nombre,
        Permiso.id_permiso != id_permiso
    ).first():
        raise ValueError("Ya existe un permiso con ese nombre")

    if not permiso:
        raise ValueError("Permiso no encontrado")

    permiso.nombre = nombre
    permiso.descripcion = descripcion

    db.commit()
    db.refresh(permiso)
    return permiso

def eliminar_permiso(db: Session, id_permiso):
    permiso = db.query(Permiso).get(id_permiso)
    if not permiso:
        raise ValueError("Permiso no encontrado")

    db.delete(permiso)
    db.commit()
    return {"msg": "Permiso eliminado"}
