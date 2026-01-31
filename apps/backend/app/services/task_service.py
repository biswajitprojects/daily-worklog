# backend/app/services/task_service.py
from app.crud.task_crud import create_tasks_for_user, get_tasks_for_user

def add_tasks(user_id: str, tasks_payload: list, app_id: str = None):
    # validation could be added here
    created = create_tasks_for_user(user_id, tasks_payload, app_id)
    return created

def fetch_tasks(requesting_user: dict, userId: str | None = None, app_id: str = None):
    """
    requesting_user: {'id':..., 'role':...}
    If userId is provided and the caller is admin, return that user's tasks.
    Otherwise return the caller's tasks.
    """
    if userId:
        if requesting_user.get("role") != "admin":
            raise PermissionError("Admin only")
        target = userId
    else:
        target = requesting_user.get("id")
    return get_tasks_for_user(target, app_id)
