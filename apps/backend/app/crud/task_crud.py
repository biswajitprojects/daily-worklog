# backend/app/crud/task_crud.py
from sqlalchemy.orm import Session
from app.models.task_model import Task
from typing import List
import uuid
from datetime import datetime

def create_tasks_for_user(user_id: str, tasks: List[dict], db: Session):
    """Create multiple tasks for a user"""
    created = []
    for t in tasks:
        task_id = str(uuid.uuid4())
        db_task = Task(
            id=task_id,
            user_id=user_id,
            project=t["project"],
            task_name=t["taskName"],
            hour=t["hour"],
            billing_status=t.get("billing_status", "pending"),
            date=t["date"],
            status="submitted",
            edit_request_pending=False,
            created_at=datetime.utcnow()
        )
        db.add(db_task)
        created.append(db_task)
    
    db.commit()
    
    return [
        {
            "id": t.id,
            "userId": t.user_id,
            "project": t.project,
            "taskName": t.task_name,
            "hour": t.hour,
            "billing_status": t.billing_status,
            "date": t.date,
            "status": t.status,
            "edit_request_pending": t.edit_request_pending
        }
        for t in created
    ]

def get_tasks_for_user(user_id: str, db: Session):
    """Get all tasks for a user"""
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    out = []
    for t in tasks:
        out.append({
            "id": t.id,
            "userId": t.user_id,
            "project": t.project,
            "taskName": t.task_name,
            "hour": t.hour,
            "billing_status": t.billing_status,
            "date": t.date,
            "status": t.status,
            "edit_request_pending": t.edit_request_pending
        })
    return out
