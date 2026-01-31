# Task Track - PostgreSQL Migration Summary

## What Was Changed

### 1. Backend Dependencies (`requirements.txt`)
**Removed:** `firebase-admin==6.0.1`
**Added:**
- `sqlalchemy==2.0.23` (ORM)
- `psycopg2-binary==2.9.9` (PostgreSQL driver)
- `alembic==1.12.1` (Database migrations)

### 2. Database Layer

#### Created: `backend/app/core/database.py`
- SQLAlchemy engine setup
- Session factory
- Dependency injection for FastAPI

#### Updated: `backend/app/core/config.py`
- Replaced Firebase config with PostgreSQL `DATABASE_URL`
- Now reads from environment variables

### 3. Data Models (SQLAlchemy ORM)

#### `backend/app/models/user_model.py`
- Added SQLAlchemy `User` class
- Relationships with `Task` model
- Role enum support

#### `backend/app/models/task_model.py`
- Added SQLAlchemy `Task` class
- Foreign key to `User`
- Maintains all original fields

### 4. Database Operations (CRUD)

#### `backend/app/crud/user_crud.py`
- Replaced Firestore calls with SQLAlchemy queries
- `create_user_doc()` - Create user
- `list_users()` - Get all users
- `get_user()` - Get by ID

#### `backend/app/crud/task_crud.py`
- Replaced Firestore with SQLAlchemy
- `create_tasks_for_user()` - Create multiple tasks
- `get_tasks_for_user()` - Retrieve user's tasks

### 5. Application Setup (`backend/app/main.py`)
- Added database table creation
- Imported SQLAlchemy engine and models

### 6. Environment Configuration (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/task_track_db
JWT_SECRET=your-secret
JWT_ALGORITHM=HS256
API_PREFIX=/api
APP_ID=default
```

---

## Quick Start Guide

### 1. Install PostgreSQL
Download: https://www.postgresql.org/download/windows/

### 2. Create Database
```sql
CREATE DATABASE task_track_db;
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Update `.env` File
Set correct PostgreSQL credentials:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_track_db
```

### 5. Start Backend
```bash
python -m uvicorn app.main:app --reload
```
- API runs on: http://localhost:8000
- Docs: http://localhost:8000/docs

### 6. Start Frontend
```bash
cd frontend
npm run dev
```
- Frontend runs on: http://localhost:3000

### 7. Connect Frontend to Backend
Create `frontend/src/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiCall = async (endpoint: string, method = 'GET', body) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return response.json();
};
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Database Schema

### Users Table
```
id              | String (PK)
first_name      | String
last_name       | String
role            | Enum (admin, employee)
created_at      | DateTime
```

### Tasks Table
```
id                      | String (PK)
user_id                 | String (FK → Users)
project                 | String
task_name               | String
hour                    | Float
billing_status          | String
date                    | String (ISO format)
status                  | String
edit_request_pending    | Boolean
created_at              | DateTime
```

---

## File Changes Summary

| File | Change | Type |
|------|--------|------|
| `requirements.txt` | Firebase → SQLAlchemy + PostgreSQL | Modified |
| `app/core/config.py` | Firestore config → PostgreSQL | Modified |
| `app/core/database.py` | **NEW** - SQLAlchemy setup | Created |
| `app/models/user_model.py` | Pydantic → SQLAlchemy + Pydantic | Modified |
| `app/models/task_model.py` | Pydantic → SQLAlchemy + Pydantic | Modified |
| `app/crud/user_crud.py` | Firestore → SQL queries | Modified |
| `app/crud/task_crud.py` | Firestore → SQL queries | Modified |
| `app/main.py` | Added DB table creation | Modified |
| `.env` | Firebase → PostgreSQL config | Modified |
| `SETUP_POSTGRESQL.md` | **NEW** - Complete setup guide | Created |

---

## Next Steps

1. ✅ Review the structure (you're here)
2. ✅ Install PostgreSQL
3. ✅ Create the database
4. ✅ Install Python dependencies
5. ✅ Configure `.env` file
6. ✅ Start backend & frontend
7. ✅ Test API endpoints at http://localhost:8000/docs
8. ✅ Connect frontend components using `apiCall()` utility

---

## Testing the Connection

### Test Backend Health
```bash
curl http://localhost:8000/
# Response: {"message": "API is running successfully"}
```

### Test Database Connection
```bash
curl http://localhost:8000/api/users
# Response: [] (empty list initially)
```

### Create a User
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "userId": "user1",
    "role": "employee"
  }'
```

---

## Support Files

- **Detailed Setup**: See `SETUP_POSTGRESQL.md`
- **API Documentation**: http://localhost:8000/docs (when backend is running)
- **Frontend Integration**: Use `frontend/src/utils/api.ts` helper

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (Next.js)                     │
│  - React Components                                 │
│  - API Client (src/utils/api.ts)                    │
│  - Running on http://localhost:3000                │
└──────────────┬──────────────────────────────────────┘
               │ HTTP Requests (JSON)
               │ Authorization: Bearer {JWT}
               ▼
┌─────────────────────────────────────────────────────┐
│          BACKEND (FastAPI)                          │
│  - API Routes (auth, users, tasks, requests)        │
│  - JWT Authentication                              │
│  - SQLAlchemy ORM                                   │
│  - Running on http://localhost:8000                │
└──────────────┬──────────────────────────────────────┘
               │ SQL Queries
               ▼
┌─────────────────────────────────────────────────────┐
│        DATABASE (PostgreSQL)                        │
│  - Users Table                                      │
│  - Tasks Table                                      │
│  - Running on localhost:5432                        │
└─────────────────────────────────────────────────────┘
```

Ready to start? Follow the steps in `SETUP_POSTGRESQL.md`!
