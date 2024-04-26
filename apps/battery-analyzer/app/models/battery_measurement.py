from aio_pika import logger
from pydantic import BaseModel, Field
from typing import List, Tuple, Optional
from datetime import datetime, timedelta
from app.models.mongo import PyObjectId
from bson import ObjectId
import numpy as np


# Define a function to calculate the average voltage drop over a specified number of minutes.
def average_voltage_drop(measurements: List[Tuple[datetime, float]], drop_minutes: int = 12) -> float:
    if not measurements or drop_minutes <= 0:
        return 0.0  # Return 0 or some form of indication for no measurements or invalid duration

    # Sort measurements to ensure they are in chronological order.
    measurements.sort()

    logger.info(measurements)

    # Calculate the end time for the measurement interval from the start.
    start_time = measurements[0][0]
    measurement_end_time = start_time + timedelta(minutes=drop_minutes)

    # Filter measurements to those within the specified minutes from the start time.
    relevant_measurements = [measurement for measurement in measurements if measurement[0] <= measurement_end_time]

    if len(relevant_measurements) < 2:
        return 0.0  # Not enough data to calculate a drop

    # Extract times and voltages.
    times = [measurement[0] for measurement in relevant_measurements]
    np_date_times = np.array(times, dtype="datetime64[s]")
    voltages = [measurement[1] for measurement in relevant_measurements]

    # Calculate voltage drop per minute (slope).
    logger.info(times)
    logger.info(voltages)
    voltage_differences = np.diff(voltages)
    time_differences = (np.diff(np_date_times).astype(float) + 0.0001) / 60
    voltage_drops = voltage_differences / time_differences

    logger.info(voltage_differences)
    logger.info(time_differences)
    logger.info(voltage_drops)

    # Return the average voltage drop per minute.
    logger.info(float(np.mean(voltage_drops)))
    return abs(float(np.mean(voltage_drops)))


class BatteryMeasurement(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    slug: str
    measurements: List[Tuple[datetime, float]]
    quality: Optional[int] = None

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

    def __repr__(self):
        return f"BatteryMeasurement(slug={self.slug}, measurements={self.measurements}, " f"quality={self.quality})"

    def assess_quality(self):
        """Assess the battery quality based on voltage drop criteria."""
        drop = average_voltage_drop(self.measurements, 12)  # Analyze over the first 10 minutes
        # Define voltage drop thresholds and their corresponding quality ratings
        drop_to_quality = {0.5: 5, 1.0: 4, 1.5: 3, 2.0: 2}

        # Determine the quality based on voltage drop
        for threshold, quality in sorted(drop_to_quality.items()):
            if drop < threshold:
                self.quality = quality
                return

        self.quality = 1
