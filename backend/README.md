# MasterCook Backend

API REST construida con **FastAPI** para un SaaS multi-tenant de gestión de
recetas y cotización de eventos de catering.

Regla central: **todo el sistema se aísla por `empresa_id`**. Un usuario
autenticado pertenece a una `Empresa` y solo puede ver, crear o modificar
registros que pertenezcan a esa misma empresa.

---

## Stack

| Capa             | Tecnología                                          |
| ---------------- | --------------------------------------------------- |
| Framework        | FastAPI 0.136                                       |
| ORM              | SQLAlchemy 2.0 (estilo `select()`)                  |
| Validación       | Pydantic v2 (`ConfigDict(from_attributes=True)`)    |
| Base de datos    | PostgreSQL (vía `psycopg2-binary`)                  |
| Migraciones      | Alembic                                             |
| Autenticación    | JWT (`python-jose`) + hashing PBKDF2 (`passlib`)    |
| Archivos / media | `StaticFiles` montado en `/uploads`                 |
| Server           | Uvicorn                                             |

---

## Estructura del proyecto

```
backend/
├── alembic/                    Migraciones de BD
├── alembic.ini
├── requirements.txt
├── uploads/                    Imágenes subidas (ignorado por git)
│   └── empresas/{id}/recetas/
└── app/
    ├── main.py                 Punto de entrada FastAPI
    ├── core/
    │   ├── config.py           Lee variables de entorno
    │   └── security.py         Hashing + JWT (incluye empresa_id)
    ├── database/
    │   ├── database.py         engine, SessionLocal, get_db
    │   └── base.py             Registra todos los modelos
    ├── dependencies/
    │   └── autenticacion.py    Dependencias multi-tenant (ver abajo)
    ├── models/                 Modelos SQLAlchemy (todo en español)
    ├── schemas/                Esquemas Pydantic (Crear / Actualizar / Salida)
    ├── services/               Lógica de negocio (merma, costos, imágenes…)
    └── routes/                 Endpoints HTTP
```

---

## Arquitectura de datos (4 bloques)

### Bloque 1 — Seguridad, usuarios y multi-tenant

| Tabla            | Propósito                                                          |
| ---------------- | ------------------------------------------------------------------ |
| `empresas`       | El **tenant**. Toda fila operativa apunta aquí.                    |
| `personas`       | Datos biográficos (nombre, apellidos, teléfono).                   |
| `usuarios`       | Autenticación. FK a `empresas` y `personas`. Guarda `password_hash`. |
| `roles`          | Roles RBAC. Cada rol pertenece a una empresa.                      |
| `usuarios_roles` | Pivote N:N entre usuarios y roles.                                 |
| `representantes` | Dueño legal / administrador principal de la empresa.               |
| `auditorias`     | Bitácora: qué usuario movió qué fila, en qué tabla y cuándo.       |

### Bloque 2 — Directorio y operación base

| Tabla                  | Propósito                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `clientes`             | Directorio de clientes (no acceden al sistema).            |
| `unidades_medida`      | Catálogo global: Kilos, Litros, Piezas, etc.               |
| `conversiones_unidades`| Factores entre unidades (ej. Kg → Gramos = 1000).          |
| `ingredientes`         | Insumos por empresa. Incluye `costo_base`, `peso_bruto`, `peso_neto` y `merma_porcentaje` calculada automáticamente. |

### Bloque 3 — Recetas

| Tabla                   | Propósito                                                |
| ----------------------- | -------------------------------------------------------- |
| `recetas`               | Platillos y sub-recetas. Tiene `costo_total_calculado` e `imagen_url`. |
| `recetas_ingredientes`  | Pivote receta ↔ ingrediente con `cantidad` y `unidad_medida_id`. |

### Bloque 4 — Cotizaciones / eventos

| Tabla                    | Propósito                                                |
| ------------------------ | -------------------------------------------------------- |
| `cotizaciones`           | El evento a vender. FK a `clientes`. Tiene `costo_operativo` y `precio_venta`. |
| `cotizaciones_detalles`  | Platillos del evento (FK a `recetas`).                   |

---

## Aislamiento multi-tenant — ¿cómo funciona?

1. El JWT emitido al hacer login lleva el `empresa_id` del usuario
   ([core/security.py](app/core/security.py) → `crear_access_token`).
2. Cada endpoint que opera sobre datos del tenant declara:

   ```python
   def listar(
       db: Session = Depends(get_db),
       empresa_id: int = Depends(obtener_empresa_actual_id),
   ): ...
   ```

3. `obtener_empresa_actual_id`
   ([dependencies/autenticacion.py](app/dependencies/autenticacion.py))
   decodifica el JWT, valida al usuario y devuelve su `empresa_id`.
4. La consulta SQL **siempre** incluye `WHERE empresa_id = :empresa_id`.

Helpers disponibles:

| Función                          | Para qué sirve                                                    |
| -------------------------------- | ----------------------------------------------------------------- |
| `obtener_usuario_actual`         | Inyecta el `Usuario` autenticado.                                 |
| `obtener_empresa_actual_id`      | Inyecta su `empresa_id`.                                          |
| `obtener_objeto_del_tenant`      | `GET por id` filtrado por tenant (404 si pertenece a otra empresa). |
| `con_filtro_tenant`              | Agrega `WHERE empresa_id = ...` a cualquier `select`.             |
| `requiere_roles(["ADMIN", ...])` | RBAC tenant-scoped (lee `usuarios_roles` + `roles`).              |

---

## Lógica de negocio clave

### Merma de ingredientes
[`services/ingrediente_service.py`](app/services/ingrediente_service.py)

```
merma_porcentaje = ((peso_bruto - peso_neto) / peso_bruto) * 100
```

Se calcula automáticamente en el backend al crear/actualizar un ingrediente.
El cliente no la envía.

### Costo dinámico de recetas
[`services/receta_service.py`](app/services/receta_service.py)

Por cada ingrediente de la receta:
1. Convierte la cantidad a la unidad base del ingrediente (vía `conversiones_unidades`).
2. Aplica la merma para obtener el costo efectivo:
   `costo_base / (1 - merma_porcentaje / 100)`.
3. Suma `cantidad_normalizada * costo_efectivo` en `costo_total_calculado`.

Se recalcula al crear, actualizar o llamar
`POST /recetas/{id}/recalcular-costo`.

### Totales de cotización
[`services/cotizacion_service.py`](app/services/cotizacion_service.py)

- `costo_operativo`: suma del costo por porción de cada receta × porciones vendidas.
- `precio_venta`: suma de `precio_unitario × cantidad_porciones`.

---

## Endpoints

Base URL local: `http://127.0.0.1:8000`

### Autenticación (`/auth`)
| Método | Ruta             | Descripción                                     |
| ------ | ---------------- | ----------------------------------------------- |
| POST   | `/auth/register` | Crea un usuario (con `password` en claro, se hashea). |
| POST   | `/auth/login`    | Devuelve `{ access_token, usuario, roles }`.    |

### Empresas (`/empresas`) — solo `SUPER_ADMIN`
| Método | Ruta                | Descripción            |
| ------ | ------------------- | ---------------------- |
| GET    | `/empresas`         | Listar tenants.        |
| POST   | `/empresas`         | Crear tenant.          |
| PATCH  | `/empresas/{id}`    | Actualizar tenant.     |

### Clientes / Ingredientes / Recetas / Cotizaciones
CRUD estándar, todos tenant-aware:

```
GET    /<recurso>            Lista (filtrada por empresa)
POST   /<recurso>            Crea (inyecta empresa_id)
GET    /<recurso>/{id}       Detalle (404 si es de otro tenant)
PATCH  /<recurso>/{id}       Actualiza
DELETE /<recurso>/{id}       Elimina
```

Extras útiles:

| Método | Ruta                                | Descripción                              |
| ------ | ----------------------------------- | ---------------------------------------- |
| POST   | `/recetas/{id}/recalcular-costo`    | Recalcula `costo_total_calculado`.       |
| POST   | `/recetas/{id}/imagen`              | Sube imagen (JPG/PNG/WEBP, máx 5 MB).    |
| DELETE | `/recetas/{id}/imagen`              | Borra la imagen actual.                  |

### Unidades (`/unidades`) — catálogo global
| Método | Ruta                       | Auth        |
| ------ | -------------------------- | ----------- |
| GET    | `/unidades`                | Cualquier usuario logueado |
| POST   | `/unidades`                | `SUPER_ADMIN` |
| GET    | `/unidades/conversiones`   | Cualquier usuario logueado |
| POST   | `/unidades/conversiones`   | `SUPER_ADMIN` |

### Imágenes
Servidas en `/uploads/empresas/{empresa_id}/recetas/{archivo}`.

Documentación interactiva en **`/docs`** (Swagger) y **`/redoc`**.

---

## Variables de entorno

Crea `backend/.env` con:

```env
DATABASE_URL=postgresql+psycopg2://usuario:password@localhost:5432/mastercook
SECRET_KEY=cambiame_por_un_secreto_largo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

> `core/security.py` define un `SECRET_KEY` por defecto, pero en cualquier
> entorno real **siempre** debe venir del `.env`.

---

## Setup

```powershell
cd backend

# 1. Crear venv (solo la primera vez)
python -m venv venv

# 2. Activar
.\venv\Scripts\Activate.ps1
# Si PowerShell lo bloquea:
# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear el .env (ver sección anterior)

# 5. Crear las tablas
# Opción rápida (dev): main.py corre Base.metadata.create_all al arrancar.
# Opción "pro": usar Alembic.
alembic upgrade head
```

## Correr el servidor

```powershell
uvicorn app.main:app --reload
```

O sin activar el venv:

```powershell
.\backend\venv\Scripts\uvicorn.exe app.main:app --reload --app-dir backend
```

- App: <http://127.0.0.1:8000>
- Swagger UI: <http://127.0.0.1:8000/docs>
- Redoc: <http://127.0.0.1:8000/redoc>

---

## Flujo típico de uso

1. **`POST /auth/register`** — crear un usuario (asocialo a `empresa_id`).
2. **`POST /auth/login`** — recibir el `access_token`.
3. En cada request siguiente, header:
   `Authorization: Bearer <access_token>`.
4. Crear catálogo: unidades, ingredientes, clientes.
5. **`POST /recetas`** con `ingredientes` → el backend calcula `costo_total_calculado`.
6. **`POST /recetas/{id}/imagen`** para adjuntar la foto.
7. **`POST /cotizaciones`** con `cliente_id` y `detalles[]` (`receta_id`,
   `cantidad_porciones`, `precio_unitario`) → el backend calcula
   `costo_operativo` y `precio_venta`.

---

## Migraciones con Alembic

```powershell
# Generar migración desde los modelos
alembic revision --autogenerate -m "describe el cambio"

# Aplicar
alembic upgrade head

# Revertir la última
alembic downgrade -1
```

Para que `--autogenerate` detecte los modelos, `alembic/env.py` debe importar
`from app.database.base import Base` y usar `target_metadata = Base.metadata`.

---

## Convenciones

- **Nombres en español** para tablas, columnas y endpoints
  (`empresas`, `nombre_evento`, `personas_estimadas`).
- **Schemas Pydantic** con sufijos `Crear`, `Actualizar`, `Salida`.
- **Todos los modelos** se importan desde `app/database/base.py` para que
  SQLAlchemy los registre antes de `create_all` o de Alembic.
- **Nunca** se confía en `empresa_id` del request body para operaciones
  tenant-aware: siempre viene del JWT.
- **Imágenes** se guardan por tenant: `uploads/empresas/{empresa_id}/recetas/`.
  Agrega `backend/uploads/` a `.gitignore`.

---

## Troubleshooting

| Síntoma                                                | Causa probable / fix                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------- |
| `ModuleNotFoundError: app`                             | Estás corriendo uvicorn fuera de `backend/`. Usa `--app-dir backend`. |
| `sqlalchemy.exc.OperationalError`                      | `DATABASE_URL` mal apuntada o Postgres apagado.                     |
| `401 Token invalido`                                   | El token expiró o falta el header `Authorization: Bearer ...`.      |
| `403 El usuario no esta asociado a una empresa`        | El usuario tiene `empresa_id = NULL`. Asígnaselo.                   |
| `404` al pedir un recurso que sí existe                | Pertenece a otra empresa → aislamiento funcionando.                 |
| Activate.ps1 bloqueado                                 | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`. |
