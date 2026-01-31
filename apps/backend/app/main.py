# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, users, tasks, requests as requests_api

# Create tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="TaskTrack API")

# CORS: Restrict origins in production for security
if os.getenv("ENV", "development") == "production":
    allowed_origins = [
        "https://your-production-frontend.com",
        "https://your-admin-dashboard.com"
    ]
else:
    allowed_origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers

# TODO: Enforce role-based authorization checks in routers for sensitive endpoints
app.include_router(auth.router, prefix=f"{settings.API_PREFIX}/auth", tags=["auth"])
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(tasks.router, prefix=f"{settings.API_PREFIX}/tasks", tags=["tasks"])
app.include_router(requests_api.router, prefix=f"{settings.API_PREFIX}/requests", tags=["requests"])

@app.get("/")
def home():
    return {"message": "API is running successfully"}
