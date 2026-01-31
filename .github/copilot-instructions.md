# ConvergenceMP AI Agent Instructions

## 🏗️ Architecture Overview

**ConvergenceMP** is a monorepo e-commerce platform with 3 independent services:
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy ORM
- **Frontend**: Next.js (React) + TailwindCSS/Bootstrap (customer store)
- **NextAdmin**: Next.js + ApexCharts (admin dashboard)

All services deployed to **Render** with separate staging/production environments.

### Key Data Flow
1. Frontend/NextAdmin → Backend API (REST)
2. Backend → PostgreSQL (ORM via SQLAlchemy)
3. Database migrations via Alembic

## 🔑 Critical Patterns & Conventions

### Backend (FastAPI)

**Router Organization** (`apps/backend/app/routers/`)
- One router file per resource (e.g., `products.py`, `orders.py`, `users.py`)
- Router imported in `main.py` and registered with app
- Each router uses `APIRouter` with prefix and tags
- Example: `router = APIRouter(prefix="/products", tags=["Products"])`

**Database Models** (`apps/backend/app/models/`)
- SQLAlchemy ORM models with relationships defined
- All models imported in `database.py` (critical for relationship resolution)
- Use `relationship()` with `back_populates` for bi-directional links
- Example: `orders = relationship("Order", back_populates="customer")`

**Pydantic Schemas** (`apps/backend/app/schemas/`)
- Request/response validation models separate from DB models
- `*Create` for POST requests, `*Out` for responses
- Example: `ProductCreate` for POST, `ProductOut` for GET response

**CRUD Operations** (`apps/backend/app/crud.py`)
- Centralized database operations (mostly basic, extensible pattern)
- Functions take `db: Session` and return model instances

**Authentication**
- JWT tokens via `python-jose` + bcrypt password hashing
- Token creation in `auth/utils.py`
- Config in `config.py` loads from environment
- Routes protected with `Depends(get_db)` dependency injection

### Frontend (Next.js)

**App Router** (`apps/frontend/app/`)
- Route groups via parentheses: `(ecommerce)`, `(services)`, `(cms)` for layout organization
- No URL impact, enables shared layouts
- API client in `config/api.ts`

**Context & State** (`apps/frontend/context/`)
- Auth, Cart, Wishlist, Currency contexts
- Use Context API + Providers pattern
- Example: `AuthProvider` wraps app in `layout.tsx`

**Components Structure** (`apps/frontend/components/`)
- Organized by feature: `ecommerce/`, `common/`, `ui/`, `modal/`, `services/`
- TailwindCSS primary styling with Bootstrap 5 fallback
- Lucide React for icons, Swiper for carousels

### Database Patterns

**Migrations** (`apps/backend/alembic/`)
- Use `alembic revision --autogenerate -m "description"` to create
- Run `alembic upgrade head` to apply
- Migrations in SQL (`.sql`) or Python (`.py`) formats
- **Important**: Add all models to `database.py` imports before running autogenerate

**Relationships Example**
```python
# models/customer.py
class Customer(Base):
    __tablename__ = "customers"
    orders = relationship("Order", back_populates="customer")

# models/order.py
class Order(Base):
    __tablename__ = "orders"
    customer_id = Column(Integer, ForeignKey("customers.id"))
    customer = relationship("Customer", back_populates="orders")
```

## 🛠️ Developer Workflows

### Local Development Setup

**Backend**
```bash
cd apps/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r ../../requirements.txt
# Create .env with DATABASE_URL, JWT_ALGORITHM, SECRET_KEY
python -m utils.load_schema              # Load initial schema
alembic upgrade head                      # Apply migrations
uvicorn app.main:app --reload            # Start server on :8000
```

**Frontend**
```bash
cd apps/frontend
npm install
npm run dev                               # http://localhost:3000
```

**NextAdmin**
```bash
cd apps/nextadmin
npm install
npm run dev                               # http://localhost:3001
```

### Deployment
- **Staging**: Push to `staging` branch → auto-deploys via Render
- **Production**: Push to `main` branch → auto-deploys via Render
- Render configs: `render.yaml` (staging), `render-production.yaml` (prod)

### Environment Variables

**Backend** (`.env`)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `JWT_ALGORITHM`: Default "HS256"
- `JWT_EXPIRATION_MINUTES`: Token expiry (default 60)

**Frontend** (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API endpoint (must be public)

All `.env` files are gitignored. See [SECURITY.md](../SECURITY.md) for safe credential handling.

## 📋 Common Tasks

### Adding a New API Endpoint
1. Create model in `apps/backend/app/models/{resource}.py`
2. Add to `database.py` imports
3. Create schema in `apps/backend/app/schemas/{resource}.py`
4. Add CRUD functions to `apps/backend/app/crud.py`
5. Create router in `apps/backend/app/routers/{resource}.py`
6. Import and register router in `main.py`
7. Test via FastAPI Swagger UI (`:8000/docs`)

### Adding Database Migration
```bash
cd apps/backend
alembic revision --autogenerate -m "your description"
alembic upgrade head
```

### Modifying Frontend Route
- Edit `apps/frontend/app/{route}/page.tsx`
- Use route groups (parentheses) to organize without affecting URLs
- Import contexts/components as needed

### Troubleshooting Common Issues

**Database connection error**
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL running and accessible
- Check migration status: `alembic current`

**JWT token issues**
- Verify `SECRET_KEY` set and non-empty
- Check token expiry: `ACCESS_TOKEN_EXPIRE_MINUTES`
- Token validation in `auth/utils.py`

**CORS errors**
- Add origin to `origins` list in `apps/backend/app/main.py`
- Required for frontend calls to backend API

## 🔐 Security Notes

- **Never commit `.env` files** (already gitignored)
- **All credentials via environment variables** (see SECURITY.md)
- Password hashing: bcrypt with 12 rounds
- JWT algorithm: HS256 (configurable)
- CORS allows `*` in staging (remove for production)

## 📂 Key Files Reference

- **Main entry**: [apps/backend/app/main.py](../apps/backend/app/main.py)
- **Database setup**: [apps/backend/app/database.py](../apps/backend/app/database.py)
- **Auth logic**: [apps/backend/app/auth/utils.py](../apps/backend/app/auth/utils.py)
- **Deployment configs**: [render.yaml](../render.yaml), [render-production.yaml](../render-production.yaml)
- **Frontend layout**: [apps/frontend/app/layout.tsx](../apps/frontend/app/layout.tsx)
- **Admin dashboard**: [apps/nextadmin/src/app](../apps/nextadmin/src/app)

## 🚀 Quick Command Reference

| Task | Command |
|------|---------|
| Start backend dev | `cd apps/backend && uvicorn app.main:app --reload` |
| Start frontend dev | `cd apps/frontend && npm run dev` |
| Create migration | `cd apps/backend && alembic revision --autogenerate -m "desc"` |
| Apply migrations | `cd apps/backend && alembic upgrade head` |
| Build for production | `npm run build` (in frontend or nextadmin dir) |
| API docs | Visit `http://localhost:8000/docs` when backend running |

---

**Last Updated**: December 2025
