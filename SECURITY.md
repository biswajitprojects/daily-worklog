# Security Guidelines

## Credential Management

### ✅ DO
- Store all credentials in `.env` files (which are gitignored)
- Pass credentials via environment variables
- Pass credentials via command-line arguments
- Use a password manager to store and access secrets
- Read credentials from CI/CD pipeline environment variables

### ❌ DO NOT
- **Hardcode credentials in Python files**
- **Commit `.env` files to git**
- **Share credentials via email, chat, or git commits**
- **Log passwords to console output**
- **Include credentials in error messages**
- **Store credentials in documentation**

## Files with Credentials (Properly Secured)

### `.env` Files (Gitignored)
```
apps/backend/.env          ✓ Gitignored - safe to contain credentials
apps/frontend/.env         ✓ Gitignored - safe to contain credentials
apps/nextadmin/.env        ✓ Gitignored - safe to contain credentials
```

These files are in `.gitignore` and will never be committed to the repository.

## Utility Scripts (No Hardcoded Credentials)

All database utility scripts in `apps/backend/utils/` accept credentials only via:
1. Environment variables (from `.env` or system)
2. Command-line arguments

### `load_schema.py`
- **Purpose**: Load initial database schema from SQL file
- **Credentials Source**: `DATABASE_URL` environment variable
- **No hardcoded secrets** ✓

### `create_database.py`
- **Purpose**: Create new PostgreSQL database and user
- **Credentials Source**: Command-line argument `admin_database_url`
- **No hardcoded secrets** ✓

### `grant_permissions.py`
- **Purpose**: Grant schema permissions to a database user
- **Credentials Source**: Command-line argument `admin_database_url`
- **No hardcoded secrets** ✓

### `apps/backend/scripts/sync_weights.py`
- **Purpose**: Sync product weights from MySQL to PostgreSQL
- **Credentials Source**: Environment variables
  - `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, etc.
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, etc.
- **No hardcoded secrets** ✓

## Recent Security Corrections

1. ✓ Removed hardcoded credentials from `sync_weights.py`
2. ✓ Secured all utility scripts to use environment variables only
3. ✓ Created `.env` files (gitignored) for local development
4. ✓ Documented security practices in README.md files

## CI/CD and Deployment

### Render Environment Variables
Store these in Render dashboard (Settings > Environment):
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30
SECRET_KEY=your-secret-key-here
```

### GitHub Secrets (if using GitHub Actions)
Store sensitive values in GitHub Settings > Secrets:
```
DATABASE_URL
JWT_ALGORITHM
SECRET_KEY
```

## Verification

To verify no credentials are hardcoded:
```bash
# Search for suspicious patterns
grep -r "postgresql://" apps/backend/*.py
grep -r "password" apps/backend/*.py
grep -r "mysql://" apps/backend/*.py

# These patterns in .env or documentation are safe
# These patterns in Python code are NOT safe
```

## Incident Response

If you accidentally commit credentials:
1. Immediately rotate all passwords
2. Force push to remove from history: `git push --force`
3. Notify your team
4. Update all related API keys and tokens

---

**Last Updated**: January 2025
**Status**: All files secured ✓
