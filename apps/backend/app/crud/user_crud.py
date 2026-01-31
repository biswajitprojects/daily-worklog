# backend/app/crud/user_crud.py
from sqlalchemy.orm import Session
from app.models.user_model import User, UserRole
from datetime import datetime

def create_user_doc(user: dict, db: Session):
    """Create a new user
    user: { userId, firstName, lastName, role }
    """
    db_user = User(
        id=user["userId"],
        first_name=user["firstName"],
        last_name=user["lastName"],
        role=UserRole[user.get("role", "employee")],
        created_at=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "id": db_user.id,
        "name": f"{db_user.first_name} {db_user.last_name}",
        "role": db_user.role.value,
        "creation_date": db_user.created_at.isoformat()
    }

def list_users(db: Session):
    """List all users"""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": f"{u.first_name} {u.last_name}",
            "role": u.role.value,
            "creation_date": u.created_at.isoformat()
        }
        for u in users
    ]

def get_user(user_id: str, db: Session):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    return {
        "id": user.id,
        "name": f"{user.first_name} {user.last_name}",
        "role": user.role.value,
        "creation_date": user.created_at.isoformat()
    }
