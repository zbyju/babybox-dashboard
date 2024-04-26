from app.core.database import db
from app.models.battery_measurement import BatteryMeasurement
import logging


logger = logging.getLogger(__name__)


async def fetch_all_measurements():
    """Fetch all measurements without sorting in the database"""
    cursor = db.client[db.db_name]["measurements"].find()
    measurements = []
    async for document in cursor:
        measurements.append(BatteryMeasurement(**document))
    # Sort measurements based on the first measurement's timestamp
    return sorted(measurements, key=lambda x: x.measurements[0][0], reverse=True)


async def fetch_measurements_by_slug(slug):
    """Fetch all measurements for a specific slug without sorting in the database"""
    cursor = db.client[db.db_name]["measurements"].find({"slug": slug})
    measurements = []
    async for document in cursor:
        measurements.append(BatteryMeasurement(**document))
    # Sort measurements based on the first measurement's timestamp
    return sorted(measurements, key=lambda x: x.measurements[0][0], reverse=True)


async def create_measurement(measurement: BatteryMeasurement):
    """Insert a new measurement into the database"""
    # Convert the BatteryMeasurement instance to a dictionary for MongoDB insertion
    measurement_dict = measurement.model_dump(by_alias=True)  # `by_alias=True` to handle any field aliases properly
    if "quality" in measurement_dict:
        del measurement_dict["quality"]
    # Insert into the MongoDB database
    result = await db.client[db.db_name]["measurements"].insert_one(measurement_dict)
    return result.inserted_id


async def delete_measurement(measurement_id):
    """Delete a measurement from the database by its ID"""
    result = await db.client[db.db_name]["measurements"].delete_one({"_id": measurement_id})
    return result.deleted_count
