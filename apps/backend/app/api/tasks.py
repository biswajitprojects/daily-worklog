# backend/app/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.auth_middleware import get_current_user
from app.models.task_model import TaskCreate
from app.services.task_service import add_tasks, fetch_tasks

router = APIRouter()

@router.post("/")
async def create_tasks(payload: List[TaskCreate], current=Depends(get_current_user)):
    # Employee or admin may create tasks (admins might create on behalf of user later)
    tasks_payload = [t.dict() for t in payload]
    created = add_tasks(current["id"], tasks_payload)
    return {"message": "Tasks saved", "created": created}

@router.get("/")
async def get_tasks(userId: str | None = None, current=Depends(get_current_user)):
    try:
        tasks = fetch_tasks(current, userId)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Admin only")
    return tasks
