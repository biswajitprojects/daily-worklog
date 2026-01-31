# PostgreSQL Setup - Step by Step Guide (No Code Changes)

## STEP 1: Install PostgreSQL on Windows

### 1.1 Download PostgreSQL
- Visit: https://www.postgresql.org/download/windows/
- Click "Download the installer"
- Select version 15 or latest
- Download the Windows installer

### 1.2 Run PostgreSQL Installer
1. Run the `.exe` file
2. Follow installation wizard:
   - **Installation directory**: Use default `C:\Program Files\PostgreSQL\15\`
   - **Password for postgres user**: Set a strong password (remember this!)
     - Example: `postgres123` (change in production)
   - **Port**: Keep default `5432`
   - **Locale**: Select your language
3. Uncheck "Stack Builder" if you don't need extra tools
4. Click **Finish**

### 1.3 Verify PostgreSQL Installation
Open PowerShell and run:
```powershell
psql --version
```
You should see: `psql (PostgreSQL) 15.x`

---

## STEP 2: Create the Database

### 2.1 Open PostgreSQL Command Prompt
You have 2 options:

**Option A: Using SQL Shell (psql)**
- Click **Start Menu** → Search "SQL Shell (psql)"
- Or from PostgreSQL folder in Start Menu
- Press Enter for all prompts until it asks for password
- Enter the password you set during installation

**Option B: Using PowerShell**
```powershell
psql -U postgres
```
When prompted, enter the password you set during installation.

### 2.2 Create the Database
Once in psql prompt (you'll see `postgres=#`), run:

```sql
CREATE DATABASE task_track_db;
```

Press Enter. You should see:
```
CREATE DATABASE
```

### 2.3 Verify Database Created
```sql
\l
```

You should see `task_track_db` in the list.

### 2.4 Connect to the New Database
```sql
\c task_track_db
```

You should see:
```
You are now connected to database "task_track_db" as user "postgres".
```

---

## STEP 3: Create Tables in PostgreSQL

You're now in the `task_track_db` database. Create the two tables needed for your app:

### 3.1 Create Users Table
Copy and paste this SQL command:

```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Press Enter. You should see:
```
CREATE TABLE
```

### 3.2 Create Tasks Table
Copy and paste this SQL command:

```sql
CREATE TABLE tasks (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project VARCHAR(255) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    hour FLOAT NOT NULL,
    billing_status VARCHAR(50) NOT NULL,
    date VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    edit_request_pending BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Press Enter. You should see:
```
CREATE TABLE
```

### 3.3 Verify Tables Created
```sql
\dt
```

You should see:
```
         List of relations
 Schema |  Name  | Type  |  Owner
--------+--------+-------+----------
 public | tasks  | table | postgres
 public | users  | table | postgres
(2 rows)
```

### 3.4 View Table Structure (Optional)
See what columns are in each table:

```sql
\d users
```

```sql
\d tasks
```

---

## STEP 4: Create Test Data (Optional)

### 4.1 Insert a Test User
```sql
INSERT INTO users (id, first_name, last_name, role)
VALUES ('user1', 'John', 'Doe', 'employee');
```

You should see:
```
INSERT 0 1
```

### 4.2 Insert a Test Task
```sql
INSERT INTO tasks (id, user_id, project, task_name, hour, billing_status, date, status)
VALUES ('task1', 'user1', 'Project A', 'Build API', 8.5, 'pending', '2026-01-30', 'submitted');
```

You should see:
```
INSERT 0 1
```

### 4.3 View the Data
```sql
SELECT * FROM users;
```

You should see your inserted user.

```sql
SELECT * FROM tasks;
```

You should see your inserted task.

---

## STEP 5: Configure Your Application to Connect

### 5.1 Update the `.env` File
Open `backend/.env` in VS Code and find this line:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/task_track_db
```

**Replace `password` with your actual PostgreSQL password** (the one you set during installation).

Example:
```
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/task_track_db
```

### 5.2 Check Your Python Requirements
The backend already has these dependencies in `requirements.txt`:
- `sqlalchemy==2.0.23` ✅
- `psycopg2-binary==2.9.9` ✅

These are needed to connect Python to PostgreSQL.

### 5.3 Install Python Dependencies (if not done)
Open PowerShell and navigate to backend folder:

```powershell
cd "D:\2025\domestic\cleonix\New-next-app\task-track\backend"
pip install -r requirements.txt
```

---

## STEP 6: Test the Connection

### 6.1 Start Backend Server
In the `backend` folder, run:

```powershell
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Started server process [xxxx]
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 6.2 Check if Tables Exist
Go to: http://localhost:8000/docs

This opens the interactive API documentation.

### 6.3 Test API Endpoints

**Test 1: Get all users**
1. Click **GET /api/users**
2. Click **Try it out**
3. You need a token (we'll get this in Step 7)

**Test 2: Create a user**
1. Click **POST /api/users**
2. Click **Try it out**
3. Scroll down to the JSON body section
4. Enter example data:

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "userId": "user2",
  "role": "admin"
}
```

5. Click **Execute**

If you see a response with `"id": "user2"`, the connection is working! ✅

---

## STEP 7: Login & Get Authentication Token (Optional)

### 7.1 Login to Get Token
1. In Swagger UI, click **POST /api/auth/login**
2. Click **Try it out**
3. Enter:

```json
{
  "username": "admin",
  "password": "admin"
}
```

4. Click **Execute**
5. Copy the `token` from the response

### 7.2 Use Token to Test Protected Endpoints
1. Click the green **Authorize** button at the top
2. Paste your token like this: `Bearer YOUR_TOKEN_HERE`
3. Now you can test other endpoints

---

## STEP 8: Verify Everything is Connected

### 8.1 Check Backend Logs
Your backend terminal should show SQL queries being executed. Look for lines like:

```
SELECT users.id, users.first_name, users.last_name, users.role, users.created_at FROM users
```

This means it's talking to PostgreSQL! ✅

### 8.2 Verify in PostgreSQL
Keep your psql prompt open, then run:

```sql
SELECT * FROM users;
```

You should see the users you created through the API! ✅

### 8.3 Check Relationships
Verify that tasks are linked to users:

```sql
SELECT t.id, t.task_name, u.first_name 
FROM tasks t 
JOIN users u ON t.user_id = u.id;
```

---

## STEP 9: Start Frontend & Test Full Connection

### 9.1 Open New PowerShell Terminal
```powershell
cd "D:\2025\domestic\cleonix\New-next-app\task-track\frontend"
npm run dev
```

Frontend starts on: http://localhost:3000

### 9.2 Verify CORS Configuration
Your backend already has CORS enabled, so frontend can communicate with it.

Backend and Frontend are now connected! ✅

---

## Quick Reference - PostgreSQL Commands

| Command | What it does |
|---------|--------------|
| `psql -U postgres` | Connect to PostgreSQL |
| `\l` | List all databases |
| `\c database_name` | Connect to a database |
| `\dt` | List all tables |
| `\d table_name` | Show table structure |
| `SELECT * FROM users;` | See all users |
| `SELECT * FROM tasks;` | See all tasks |
| `DROP TABLE tasks;` | Delete tasks table (careful!) |
| `DROP DATABASE task_track_db;` | Delete database (careful!) |
| `\q` | Exit psql |

---

## Troubleshooting

### Issue: "password authentication failed for user 'postgres'"
**Solution:** 
- You entered the wrong password
- Check PostgreSQL logs or reinstall PostgreSQL and remember your password

### Issue: "psql: command not found"
**Solution:**
- PostgreSQL is not installed correctly
- Or it's not in your PATH
- Reinstall PostgreSQL and select "Add to PATH" during installation

### Issue: "database task_track_db does not exist"
**Solution:**
- Follow Step 2 again to create the database
- Make sure you're running the CREATE DATABASE command

### Issue: Backend shows "connection refused"
**Solution:**
- PostgreSQL service is not running
- Start: Search "Services" in Windows → Find "PostgreSQL" → Right-click → Start
- Or reinstall PostgreSQL

### Issue: "relation 'users' does not exist"
**Solution:**
- Tables weren't created
- Follow Step 3 again to create the tables

### Issue: API returns 403 "Only admin may create users"
**Solution:**
- You're not logged in as admin
- Get a token first (Step 7) and use it in the Authorize button

---

## Summary of What You Now Have

✅ PostgreSQL Database running on `localhost:5432`
✅ Database: `task_track_db` 
✅ Table: `users` with columns (id, first_name, last_name, role, created_at)
✅ Table: `tasks` with columns (id, user_id, project, task_name, hour, billing_status, date, status, edit_request_pending, created_at)
✅ Backend (FastAPI) connected to PostgreSQL
✅ Frontend (Next.js) ready to connect to Backend
✅ JWT authentication working
✅ All CRUD operations (Create, Read, Update, Delete) ready

---

## Next Steps

1. **Keep these running:**
   - Terminal 1: `python -m uvicorn app.main:app --reload` (Backend)
   - Terminal 2: `npm run dev` (Frontend)
   - PostgreSQL service (Windows Service)

2. **Create frontend components** to interact with the API using `apiCall()` helper

3. **Add more tables** as needed (requests, logs, etc.)

4. **Backup your database** before going to production

---

## Production Checklist

When deploying to production:
- [ ] Change PostgreSQL password to something strong
- [ ] Change JWT_SECRET in `.env`
- [ ] Update DATABASE_URL to point to production PostgreSQL
- [ ] Enable SSL for database connection
- [ ] Set CORS allow_origins to specific domains (not "*")
- [ ] Use environment variables, not hardcoded values
- [ ] Enable database backups
- [ ] Monitor PostgreSQL logs

---

Questions? Check the error message against the "Troubleshooting" section above.
