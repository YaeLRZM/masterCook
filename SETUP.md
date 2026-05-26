# Setup - MasterCook

## Requisitos previos

- Python 3.10+
- PostgreSQL 12+
- Node.js 18+
- npm 9+

## Backend - Configuración inicial

### 1. Variables de entorno

Crea un archivo `.env` en `backend/`:

```bash
cd backend
cp .env.example .env  # o crea uno manualmente
```

Contenido de `.env`:

```
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/mastercook
SECRET_KEY=una_clave_secreta_larga_y_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000
MAX_UPLOAD_MB=5
```

### 2. Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 3. Inicializar base de datos

**Opción A: Script automático (recomendado)**

```bash
python scripts/init_db.py
```

Este script:
- ✓ Ejecuta las migraciones de Alembic
- ✓ Crea los 5 roles globales (SUPER_ADMIN, ADMIN, CHEF, AYUDANTE_CHEF, VENDEDOR)
- ✓ Crea el usuario SUPER_ADMIN default

Credenciales default:
- Email: `admin@mastercook.com`
- Password: `Admin@123`
- Rol: `SUPER_ADMIN`

**Opción B: Manual (si necesitas pasos específicos)**

```bash
# 1. Ejecutar migraciones
alembic upgrade head

# 2. Crear roles
python scripts/seed_roles.py

# 3. Crear usuario default
python scripts/create_default_admin.py
```

### 4. Iniciar servidor

```bash
uvicorn app.main:app --reload
```

El API estará disponible en: `http://localhost:8000`

Documentación interactiva (Swagger): `http://localhost:8000/docs`

---

## Frontend - Configuración inicial

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

---

## Flujo de uso

### 1. Login como SUPER_ADMIN

Accede a `http://localhost:3000` y usa:
- Email: `admin@mastercook.com`
- Password: `Admin@123`

### 2. Crear una empresa

Panel de control SUPER_ADMIN → Empresas → Crear empresa

### 3. Crear admin de la empresa

Panel de control SUPER_ADMIN → Empresas → Seleccionar empresa → Crear admin

El admin podrá:
- Gestionar personal de la empresa
- Asignar roles (CHEF, AYUDANTE_CHEF, VENDEDOR)
- Ver dashboard y estadísticas

---

## Estructura de directorios

```
mastercook/
├── backend/
│   ├── app/
│   │   ├── core/          # Config, seguridad, constantes
│   │   ├── database/      # Conexión a DB
│   │   ├── dependencies/  # Inyección de dependencias
│   │   ├── models/        # Modelos SQLAlchemy
│   │   ├── routes/        # Endpoints
│   │   └── schemas/       # Esquemas Pydantic
│   ├── alembic/           # Migraciones de BD
│   └── scripts/           # Scripts de utilidad
│
├── frontend/
│   ├── src/
│   │   ├── app/           # Páginas (Next.js App Router)
│   │   ├── components/    # Componentes reutilizables
│   │   ├── features/      # Servicios y lógica por feature
│   │   ├── layouts/       # Layouts
│   │   └── lib/           # Utilidades
│   └── public/            # Assets estáticos
```

---

## Troubleshooting

### Error: "Rol ADMIN no existe en el sistema"

Ejecuta: `python scripts/init_db.py`

### Error de conexión a PostgreSQL

Verifica que:
- PostgreSQL está corriendo
- DATABASE_URL es correcto
- El usuario y contraseña son válidos

### Error CORS en frontend

Asegúrate que `CORS_ORIGINS=http://localhost:3000` está en `.env`

---

## Desarrollo

### Crear una migración

```bash
cd backend
alembic revision --autogenerate -m "Descripción del cambio"
alembic upgrade head
```

### Formato de código

Backend:
```bash
black app/
flake8 app/
```

Frontend:
```bash
npm run lint
```
