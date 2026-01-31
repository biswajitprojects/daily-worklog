# Render YAML Deployment Guide

## How to Use render-staging.yaml for Automatic Deployment

Yes! The `render-staging.yaml` file can automate the entire deployment. This is much easier than creating services manually.

## Quick Start: Deploy with YAML

### Step 1: Create Staging Database

On Render Dashboard:
1. PostgreSQL → New PostgreSQL
2. Name: ``
3. Copy connection string

### Step 2: Configure YAML with Your Secrets

Edit `render-staging.yaml` and fill in the empty values:

```yaml
# Line 21 - DATABASE_URL
DATABASE_URL: ""

# Line 26 - SECRET_KEY
SECRET_KEY: "your-generated-secret-key-here"
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**⚠️ WARNING:** Do NOT commit SECRET_KEY to git. Instead:
1. Leave `SECRET_KEY: ""` empty in the file
2. Set it manually in Render dashboard after deployment (see Step 4)

### Step 3: Push to Staging Branch

```bash
git add render-staging.yaml
git commit -m "chore: configure staging YAML with database URL"
git push origin staging
```

### Step 4: Deploy via Render Dashboard

**Option A: Connect GitHub Repo (Easiest)**
1. Render Dashboard → New → Blueprint (from repo)
2. Select your GitHub repository
3. Choose branch: `staging`
4. Render will auto-detect `render-staging.yaml`
5. Click Deploy

**Option B: Upload YAML File**
1. Render Dashboard → New → Blueprint
2. Paste contents of `render-staging.yaml`
3. Click Deploy

### Step 5: Set Missing Environment Variables

After services are created, set sensitive variables in Render:

1. **Backend Service → Settings → Environment**
   - Add: `SECRET_KEY` = (your generated key)
   - Add any other missing variables

2. Render will restart services automatically

### Step 6: Initialize Database Schema

After deployment:
```bash
export DATABASE_URL=""
python -m utils.load_schema
```

## File Structure

You have:
- `render-staging.yaml` - For staging deployment (branch: staging)
- `render-production.yaml` - For production deployment (branch: main)

## What the YAML Does

The `render-staging.yaml` automatically creates:

1. **convergencemp-backend** (FastAPI)
   - Python 3.11 environment
   - Builds with: `pip install -r requirements.txt`
   - Runs on port 10000
   - Branch: staging

2. **convergencemp-frontend** (Next.js)
   - Node.js environment
   - Builds with: `npm install && npm run build`
   - Runs frontend
   - Branch: staging

3. **convergencemp-nextadmin** (Next.js)
   - Node.js environment
   - Builds with: `npm install && npm run build`
   - Runs admin panel
   - Branch: staging

## Troubleshooting

### "Failed to find render.yaml"
- Render looks for files at the root
- Make sure `render-staging.yaml` is in project root
- When deploying, explicitly reference the file

### Services stuck building
- Check logs in Render Dashboard
- Verify environment variables are set
- Check branch is correct

### "DATABASE_URL not found"
- Set in Render dashboard after deployment
- Or update YAML with actual connection string before pushing

### Port conflicts
- Backend uses port 10000
- Frontend uses port 3000
- NextAdmin uses port 3000 (but different service)

## Security Note

Never commit these to git:
- ❌ Active DATABASE_URLs
- ❌ Actual SECRET_KEY values
- ❌ Any credentials

Solution: Keep empty in file, set in Render dashboard

---

**TL;DR:**
1. Create staging database on Render
2. Edit `render-staging.yaml` - add DATABASE_URL only
3. Push to `staging` branch
4. Render Dashboard → Blueprint → Deploy
5. Set SECRET_KEY in Render dashboard
6. Load schema: `python -m utils.load_schema`
7. Done! ✅
