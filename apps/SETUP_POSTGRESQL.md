# PostgreSQL Setup Guide for Task Track

## Overview
This guide explains how to:
1. Set up PostgreSQL database
2. Connect the FastAPI backend to PostgreSQL
3. Connect the Next.js frontend to the backend

## Prerequisites
- PostgreSQL 12 or higher
- Python 3.8+
- Node.js 16+

---

## Part 1: PostgreSQL Database Setup

### Step 1: Install PostgreSQL
Download from: https://www.postgresql.org/download/windows/

During installation:
- Remember the **postgres** user password
- Note the **port** (default: 5432)

### Step 2: Create Database
Open PostgreSQL prompt (pgAdmin or cmd) and run:

```sql
-- Create database
CREATE DATABASE task_track_db;

-- (Optional) Create a dedicated user
CREATE USER task_user WITH ENCRYPTED PASSWORD 'your_secure_password';
ALTER ROLE task_user SET client_encoding TO 'utf8';
ALTER ROLE task_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE task_user SET default_transaction_deferrable TO on;
ALTER ROLE task_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE task_track_db TO task_user;
```

### Step 3: Verify Connection
```sql
psql -U postgres -d task_track_db
```

---

## Part 2: Backend Setup

### Step 1: Update Environment Variables
Edit `backend/.env`:

```env
# PostgreSQL Connection String
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_track_db

# JWT Configuration
JWT_SECRET=your-super-secret-key-here-change-in-production
JWT_ALGORITHM=HS256

# API Configuration
API_PREFIX=/api
APP_ID=default
```

**Replace values:**
- `YOUR_PASSWORD` → Your postgres user password
- `your-super-secret-key-here` → A strong random string

### Step 2: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Verify Database Connection
Test the connection:
```bash
python -c "from app.core.database import engine; engine.connect(); print('✅ Connected to PostgreSQL')"
```

### Step 4: Start Backend Server
```bash
python -m uvicorn app.main:app --reload
```

Server runs at: **http://localhost:8000**
API docs: **http://localhost:8000/docs**

---

## Part 3: Frontend Setup & Connection

### Step 1: Create API Client
Create `frontend/src/utils/api.ts`:

```typescript
// Frontend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiCall = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
```

### Step 2: Environment Configuration
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Use API in Components
Example in React component:

```typescript
import { apiCall } from '@/utils/api';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiCall('/users')
      .then(setUsers)
      .catch(console.error);
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Step 4: Start Frontend
```bash
cd frontend
npm install  # if not done yet
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Part 4: Full Integration Example

### Create a User (Backend)
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "userId": "user123",
    "role": "employee"
  }'
```

### Get Users (Frontend)
```typescript
const users = await apiCall('/users');
console.log(users);
```

---

## Database Structure

### Users Table
```
id (PK)          → String, Primary Key
first_name       → String
last_name        → String
role             → Enum (admin, employee)
created_at       → DateTime
```

### Tasks Table
```
id (PK)          → String, Primary Key
user_id (FK)     → String, Foreign Key to Users
project          → String
task_name        → String
hour             → Float
billing_status   → String
date             → String (ISO format)
status           → String (default: 'submitted')
edit_request_pending → Boolean
created_at       → DateTime
```

---

## Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Troubleshooting

### Issue: "Connection refused" to PostgreSQL
- Verify PostgreSQL service is running
- Check credentials in `.env` DATABASE_URL
- Ensure port 5432 is accessible

### Issue: "No module named 'sqlalchemy'"
```bash
pip install -r requirements.txt
```

### Issue: Frontend can't reach backend
- Verify backend running on http://localhost:8000
- Check CORS settings in `backend/app/main.py`
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

### Clear Database (Reset)
```sql
DROP DATABASE task_track_db;
CREATE DATABASE task_track_db;
```

Then restart the backend.

---

## Production Deployment

### Backend
- Set `DATABASE_URL` to production PostgreSQL
- Change `JWT_SECRET` to strong random value
- Set `allow_origins` to specific domains in CORS
- Use `uvicorn` with `--workers` flag

### Frontend
- Set `NEXT_PUBLIC_API_URL` to production backend URL
- Build: `npm run build`
- Deploy to Vercel or similar

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| GET | `/api/users/{id}` | Get user |
| POST | `/api/tasks` | Create tasks |
| GET | `/api/tasks/{userId}` | Get user's tasks |
| POST | `/api/auth/login` | User login |

See `http://localhost:8000/docs` for interactive API documentation.
