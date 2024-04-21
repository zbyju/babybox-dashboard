from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.models.mongo import PyObjectId


class NotificationTemplate(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    scope: str
    title: str
    message: str
    severity: str  # low medium high
    variable: str
    comparison: str
    value: float
    notify_new_error: bool
    delay: int
    streak: int
    emails: List[str]

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True


class Notification(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    slug: str
    template: PyObjectId
    timestamp: datetime

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
