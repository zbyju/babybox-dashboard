import json
from datetime import datetime, timedelta
import random

# Initialize the start time
start_time = datetime.now()

# Initialize lists to hold data
snapshots = []
events = []

# Define helper function to generate random temperature and voltage


def generate_snapshot(timestamp):
    return {
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "temperature": {
            "inside": random.uniform(24, 32),
            "outside": random.uniform(10, 35),
            "casing": random.uniform(10, 20),
            "bottom": random.uniform(15, 25),
            "top": random.uniform(15, 25)
        },
        "voltage": {
            "in": random.uniform(12, 14),
            "battery": random.uniform(10, 12)
        }
    }


def generate_snapshot_next(timestamp, previous):
    return {
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "temperature": {
            "inside": previous['temperature']['inside'] + random.gauss(0, 0.3),
            "outside": previous['temperature']['outside'] + random.gauss(0, 0.8),
            "casing": previous['temperature']['casing'] + random.gauss(0, 0.5),
            "bottom": previous['temperature']['bottom'] + random.gauss(0, 0.5),
            "top": previous['temperature']['top'] + random.gauss(0, 0.5),
        },
        "voltage": {
            "in": previous['voltage']['in'] + random.gauss(0, 0.1),
            "battery": previous['voltage']['battery'] + random.gauss(0, 0.1),
        }
    }

# Function to simulate event generation


def generate_event(timestamp, event_type):
    return {
        "timestamp": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "event": event_type
    }


# Simulate one week of data
end_time = start_time + timedelta(days=7)
current_time = start_time
event_toggle = True  # Toggle for turning heating/cooling on and off
event_duration = timedelta(hours=1)  # Approximate duration of each event
last_event_time = start_time - timedelta(hours=2)

while current_time < end_time:
    # Generate snapshot
    new_snapshot = generate_snapshot_next(
        current_time, snapshots[-1]) if(len(snapshots) > 0) else generate_snapshot(current_time)
    snapshots.append(new_snapshot)

    # Check if it's time to log an event (every ~1 hour)
    time_since_last_event = current_time - last_event_time
    # Roughly once every 10 hours
    if time_since_last_event > timedelta(hours=1) and random.random() < 0.1:
        event_type = random.choice(
            ["Heating On", "Cooling On", "Doors Opening"])
        events.append(generate_event(current_time, event_type))
        last_event_time = current_time  # Update the last event time
        # Logic to turn off heating/cooling or close door after some time
        if event_type in ["Heating On", "Cooling On"]:
            off_event = "Heating Off" if event_type == "Heating On" else "Cooling Off"
            events.append(generate_event(
                current_time + timedelta(minutes=30), off_event))
        elif event_type == "Doors Opening":
            events.append(generate_event(
                current_time + timedelta(minutes=10), "Doors Closing"))

    # Increment current_time by 5 minutes for the next snapshot
    current_time += timedelta(minutes=5)

# Save the data to JSON files
with open('./snapshots.js', 'w') as f:
    f.write("export const snapshots = ")
    f.write(str(snapshots))
    f.write(";")

with open('./heating_cooling_events.js', 'w') as f:
    f.write("export const events = ")
    f.write(str(events))
    f.write(";")
