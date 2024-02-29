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
            "inside": random.uniform(18, 24),
            "outside": random.uniform(5, 15),
            "casing": random.uniform(10, 20),
            "bottom": random.uniform(15, 25),
            "top": random.uniform(15, 25)
        },
        "voltage": {
            "in": random.uniform(220, 240),
            "battery": random.uniform(3.5, 4.2)
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

while current_time < end_time:
    # Generate snapshot
    snapshots.append(generate_snapshot(current_time))
    
    # Check if it's time to log an event (every ~1 hour)
    if event_toggle:
        event_type = "Heating On" if random.choice([True, False]) else "Cooling On"
        events.append(generate_event(current_time, event_type))
        event_toggle = False
    elif current_time - datetime.strptime(events[-1]["timestamp"], "%Y-%m-%d %H:%M:%S") >= event_duration:
        event_type = "Heating Off" if "Heating On" in events[-1]["event"] else "Cooling Off"
        events.append(generate_event(current_time, event_type))
        event_toggle = True
    
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
