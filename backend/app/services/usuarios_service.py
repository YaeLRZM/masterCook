from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from datetime import date
from app.models.persona import Persona
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.models.usuario_rol import UsuarioRol

def obtener_usuarios(db: Session):
    resultados = db.query(Usuario, Persona, Rol)\
        .join(Persona, Usuario.id_persona == Persona.id_persona)\
        .join(UsuarioRol, Usuario.id_usuario == UsuarioRol.id_usuario)\
        .join(Rol, UsuarioRol.id_rol == Rol.id_rol)\
        .filter(Rol.nombre != "admin")\
        .all()

    lista = []
    for usuario, persona, rol in resultados:
        lista.append({
            "id_usuario": usuario.id_usuario,
            "nombre": persona.nombre,
            "correo": persona.correo,
            "rol": rol.nombre,
            "id_rol": rol.id_rol,
            "fecha_creacion": persona.fecha_creacion,
            "activo": usuario.activo
        })
    return lista

def crear_usuario(db: Session, data):
    if db.query(Persona).filter(Persona.correo == data.correo).first():
        raise ValueError("El correo ya está registrado en el sistema")

    rol = db.query(Rol).filter(Rol.id_rol == data.id_rol).first()
    if not rol or rol.nombre == "admin":
        raise ValueError("Rol inválido o no permitido")

    nueva_persona = Persona(
        correo=data.correo,
        nombre=data.nombre,
        fecha_creacion=date.today()
    )
    db.add(nueva_persona)
    db.commit()
    db.refresh(nueva_persona)

    nuevo_usuario = Usuario(
        id_persona=nueva_persona.id_persona,
        password=bcrypt.hash(data.password),
        activo=True
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    nuevo_usuario_rol = UsuarioRol(
        id_usuario=nuevo_usuario.id_usuario,
        id_rol=data.id_rol
    )
    db.add(nuevo_usuario_rol)
    db.commit()

    return {"msg": "Usuario registrado correctamente"}

def actualizar_usuario(db: Session, id_usuario: int, data):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise ValueError("Usuario no encontrado")

    persona = db.query(Persona).filter(Persona.id_persona == usuario.id_persona).first()
    usuario_rol = db.query(UsuarioRol).filter(UsuarioRol.id_usuario == id_usuario).first()

    if data.nombre is not None:
        persona.nombre = data.nombre

    if data.correo is not None and data.correo != persona.correo:
        if db.query(Persona).filter(Persona.correo == data.correo).first():
            raise ValueError("El correo ya está en uso")
        persona.correo = data.correo

    if data.password and data.password.strip() != "":
        usuario.password = bcrypt.hash(data.password)

    if data.id_rol is not None:
        rol = db.query(Rol).filter(Rol.id_rol == data.id_rol).first()
        if not rol or rol.nombre == "admin":
            raise ValueError("No puedes asignar este rol")

        if usuario_rol:
            usuario_rol.id_rol = data.id_rol
        else:
            db.add(UsuarioRol(id_usuario=id_usuario, id_rol=data.id_rol))

    db.commit()
    return {"msg": "Datos actualizados correctamente"}

def cambiar_estado_usuario(db: Session, id_usuario: int):
    usuario = db.query(Usuario).filter(Usuario.id_usuario == id_usuario).first()
    if not usuario:
        raise ValueError("Usuario no encontrado")

    usuario.activo = not usuario.activo
    db.commit()

    estado_texto = "activado" if usuario.activo else "desactivado"
    return {"msg": f"Usuario {estado_texto} correctamente", "activo": usuario.activo}
