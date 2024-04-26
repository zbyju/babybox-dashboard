from fastapi import APIRouter, HTTPException, Path, Depends
from app.api.dependencies import get_current_user
from app.models.mongo import PyObjectId
from typing import List
from datetime import datetime, timedelta
from app.models.battery_measurement import BatteryMeasurement
import app.services.measurement_service as measurement_service

router = APIRouter()


@router.get("/", response_model=List[BatteryMeasurement])
async def get_all_measurements(_=Depends(get_current_user)):
    """Retrieves all battery measurements from the database."""
    measurements = await measurement_service.fetch_all_measurements()
    for m in measurements:
        m.assess_quality()
    return measurements


@router.get("/{slug}", response_model=List[BatteryMeasurement])
async def get_measurements_by_slug(
    slug: str = Path(..., description="The slug of the babybox to retrieve measurements for"),
    _=Depends(get_current_user),
):
    """Retrieves all battery measurements for a specified slug from the database."""
    measurements = await measurement_service.fetch_measurements_by_slug(slug)
    for m in measurements:
        m.assess_quality()
    return measurements


@router.post("/", response_model=BatteryMeasurement)
async def create_measurement_endpoint(measurement: BatteryMeasurement, _=Depends(get_current_user)):
    """Creates a new battery measurement in the database."""
    measurement_id = await measurement_service.create_measurement(measurement)
    measurement.id = measurement_id  # Assuming you want to return the new ID with the measurement
    return measurement


@router.delete("/{measurement_id}", response_model=dict)
async def delete_measurement_endpoint(measurement_id: str, _=Depends(get_current_user)):
    """Deletes a battery measurement from the database."""
    result = await measurement_service.delete_measurement(PyObjectId(measurement_id))
    if result:
        return {"status": "measurement deleted"}
    raise HTTPException(status_code=404, detail="Measurement not found")
