# backend/app/models/request_model.py
from pydantic import BaseModel
from typing import Optional

class EditRequestCreate(BaseModel):
    proposedProject: str | None = None
    proposedTaskName: str | None = None
    proposedHour: float

class EditRequestOut(BaseModel):
    id: str
    employeeId: str
    employeeName: str
    date: str
    originalHours: float
    proposedHours: float
    reason: str | None = None
    status: str  # pending / approved / rejected
