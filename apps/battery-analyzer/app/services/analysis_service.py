from datetime import datetime, timedelta
from typing import List, Tuple, Dict
from aio_pika import logger
from app.models.snapshot import Snapshot
from app.models.battery_measurement import BatteryMeasurement
from app.services import measurement_service


# Analyzer Class
class BatteryAnalyzer:
    def __init__(self) -> None:
        # Dictionary to keep track of measurement data by slug
        self.active_measurements: Dict[str, List[Tuple[datetime, float]]] = {}

    async def receive_snapshot(self, snapshot: Snapshot):
        current_time = snapshot.timestamp
        if snapshot.voltage.in_ < 3:
            if snapshot.slug not in self.active_measurements:
                return
            self.active_measurements[snapshot.slug].append((current_time, snapshot.voltage.battery))

            # Check if the recording period has exceeded 3 hours
            start_time = self.active_measurements[snapshot.slug][0][0]
            if (current_time - start_time) > timedelta(hours=3):
                await self.log_measurement(snapshot.slug)
                del self.active_measurements[snapshot.slug]
        else:
            # Check if there are any records to process before clearing
            if snapshot.slug in self.active_measurements and len(self.active_measurements[snapshot.slug]) >= 2:
                await self.log_measurement(snapshot.slug)
                del self.active_measurements[snapshot.slug]
            self.active_measurements[snapshot.slug] = [(current_time, snapshot.voltage.battery)]

    async def log_measurement(self, slug):
        if len(self.active_measurements[slug]) < 2:
            return

        # Create a BatteryMeasurement from the recorded data
        if slug in self.active_measurements:
            measurements = self.active_measurements[slug]

            if len(measurements) < 2:
                return

            battery_measurement = BatteryMeasurement(slug=slug, measurements=measurements)
            await measurement_service.create_measurement(battery_measurement)
