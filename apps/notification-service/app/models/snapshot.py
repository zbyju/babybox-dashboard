from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional
from datetime import datetime
from app.models.mongo import PyObjectId


class Temperature(BaseModel):
    inside: float
    outside: float
    casing: float
    top: float
    bottom: float


class Voltage(BaseModel):
    in_: float = Field(..., alias="in")
    battery: float


class Snapshot(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    slug: str
    temperature: Temperature
    voltage: Voltage
    version: int
    timestamp: datetime

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
