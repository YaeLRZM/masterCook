from sqlalchemy.orm import Session
from app.models.usuario_rol import UsuarioRol

def asignar_rol(db: Session, id_usuario: int, id_rol: int):
    db.add(UsuarioRol(id_usuario=id_usuario, id_rol=id_rol))
    db.commit()
    return {"msg": "Rol asignado"}

def quitar_rol(db: Session, id_usuario: int, id_rol: int):
    db.query(UsuarioRol).filter_by(
        id_usuario=id_usuario,
        id_rol=id_rol
    ).delete()
    db.commit()
    return {"msg": "Rol removido"}
