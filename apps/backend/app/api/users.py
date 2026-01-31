# backend/app/api/users.py
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth_middleware import get_current_user
from app.models.user_model import UserCreate, UserPublic
from app.crud.user_crud import create_user_doc, list_users, get_user

router = APIRouter()

@router.post("/")
async def create_user(payload: UserCreate, current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only admin may create users")
    created = create_user_doc({
        "userId": payload.userId,
        "firstName": payload.firstName,
        "lastName": payload.lastName,
        "role": payload.role
    })
    return created

@router.get("/")
async def get_all_users(current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return list_users()

@router.get("/{id}")
async def get_user_profile(id: str, current=Depends(get_current_user)):
    # allow admins or the user themselves to view
    if current.get("role") != "admin" and current.get("id") != id:
        raise HTTPException(status_code=403, detail="Forbidden")
    u = get_user(id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return u
