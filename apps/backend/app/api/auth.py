# backend/app/api/auth.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from jose import jwt

router = APIRouter()

# Simple dev users: in production replace with DB check or admin-created users
DEV_USERS = {
    "admin": {"password": "admin", "role": "admin", "id": "admin"},
    "employee": {"password": "employee", "role": "employee", "id": "employee"},
}

class LoginPayload(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(payload: LoginPayload):
    u = DEV_USERS.get(payload.username)
    if not u or payload.password != u["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"sub": u["id"], "role": u["role"]}, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return {"token": token, "user": {"id": u["id"], "name": payload.username, "role": u["role"]}}
