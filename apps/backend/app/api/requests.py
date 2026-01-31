# backend/app/api/requests.py
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth_middleware import get_current_user
from app.models.request_model import EditRequestCreate
from app.core.firestore_client import users_root
from uuid import uuid4
from datetime import datetime

router = APIRouter()

@router.post("/{task_id}/request_edit")
async def request_edit(task_id: str, payload: EditRequestCreate, current=Depends(get_current_user)):
    # employee requests edit for own task
    user_id = current["id"]
    # find task doc
    task_doc_ref = users_root().document(user_id).collection("tasks").document(task_id)
    task_doc = task_doc_ref.get()
    if not task_doc.exists:
        raise HTTPException(status_code=404, detail="Task not found")
    task_data = task_doc.to_dict()
    # create an edit request under requests collection at top-level
    # structure: artifacts/{appId}/requests/{requestId}
    app_id = None
    root = users_root(app_id).parent  # artifacts/{appId}
    requests_col = root.collection("requests")
    req_id = str(uuid4())
    req_payload = {
        "id": req_id,
        "taskId": task_id,
        "employeeId": user_id,
        "employeeName": task_data.get("userId", user_id),
        "date": datetime.utcnow().isoformat(),
        "originalHours": task_data.get("hour"),
        "proposedHours": payload.proposedHour,
        "proposedProject": payload.proposedProject,
        "proposedTaskName": payload.proposedTaskName,
        "reason": getattr(payload, "reason", None),
        "status": "pending"
    }
    requests_col.document(req_id).set(req_payload)
    # mark task as having pending edit
    task_doc_ref.update({"edit_request_pending": True})
    return {"message": "Edit request submitted", "request": req_payload}

@router.get("/")
async def get_all_requests(current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    root = users_root().parent
    docs = root.collection("requests").stream()
    out = []
    for d in docs:
        data = d.to_dict()
        data["id"] = d.id
        out.append(data)
    return out

@router.post("/{request_id}/approve")
async def approve_request(request_id: str, current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    root = users_root().parent
    req_ref = root.collection("requests").document(request_id)
    req_doc = req_ref.get()
    if not req_doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
    req_data = req_doc.to_dict()
    if req_data.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Request not pending")
    # update the task document with proposed values
    task_ref = users_root().document(req_data["employeeId"]).collection("tasks").document(req_data["taskId"])
    update_payload = {}
    if req_data.get("proposedHours") is not None:
        update_payload["hour"] = req_data["proposedHours"]
    if req_data.get("proposedProject") is not None:
        update_payload["project"] = req_data["proposedProject"]
    if req_data.get("proposedTaskName") is not None:
        update_payload["taskName"] = req_data["proposedTaskName"]
    update_payload["status"] = "approved"
    update_payload["edit_request_pending"] = False
    task_ref.update(update_payload)
    # update request
    req_ref.update({"status": "approved", "resolvedBy": current["id"], "resolvedAt": datetime.utcnow().isoformat()})
    return {"message": "Request approved"}

@router.post("/{request_id}/reject")
async def reject_request(request_id: str, current=Depends(get_current_user)):
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    root = users_root().parent
    req_ref = root.collection("requests").document(request_id)
    req_doc = req_ref.get()
    if not req_doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
    req_data = req_doc.to_dict()
    if req_data.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Request not pending")
    # unmark the task pending flag
    task_ref = users_root().document(req_data["employeeId"]).collection("tasks").document(req_data["taskId"])
    task_ref.update({"edit_request_pending": False})
    req_ref.update({"status": "rejected", "resolvedBy": current["id"], "resolvedAt": datetime.utcnow().isoformat()})
    return {"message": "Request rejected"}
