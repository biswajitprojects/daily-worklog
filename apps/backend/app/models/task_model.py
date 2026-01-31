# backend/app/models/task_model.py
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.core.database import Base

# SQLAlchemy ORM Model
class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    project = Column(String, nullable=False)
    task_name = Column(String, nullable=False)
    hour = Column(Float, nullable=False)
    billing_status = Column(String, default="pending")
    date = Column(String, nullable=False)  # ISO date string
    status = Column(String, default="submitted")
    edit_request_pending = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="tasks")

# Pydantic Models for API
class TaskCreate(BaseModel):
    project: str
    taskName: str
    hour: float
    billing_status: str
    date: str  # ISO date string YYYY-MM-DD or full ISO

class TaskOut(BaseModel):
    id: str
    userId: str
    project: str
    taskName: str
    hour: float
    billing_status: str
    date: str
    status: str
    edit_request_pending: bool
    
    class Config:
        from_attributes = True
