# backend/app/models/user_model.py
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from pydantic import BaseModel
from typing import Literal, Optional
import enum

from app.core.database import Base

# SQLAlchemy ORM Model
class UserRole(str, enum.Enum):
    admin = "admin"
    employee = "employee"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.employee)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    tasks = relationship("Task", back_populates="user")

# Pydantic Models for API
class UserCreate(BaseModel):
    firstName: str
    lastName: str
    userId: str
    role: Literal["admin", "employee"] = "employee"

class UserPublic(BaseModel):
    id: str
    name: str
    role: Literal["admin", "employee"]
    creation_date: Optional[str] = None
    
    class Config:
        from_attributes = True
