from abc import ABC, abstractmethod

from app.models.notification import NotificationTemplate
from app.models.snapshot import Snapshot
from app.services import notification_service
from app.core.logger import get_logger
from datetime import datetime
import pytz

logger = get_logger(__name__)


def evaluate_condition(snapshot: Snapshot, variable: str, comparison: str, value: float):
    """
    Evaluates a condition based on the snapshot's data and a template's criteria.

    Args:
    snapshot (Snapshot): The current snapshot data.
    variable (str): The variable in the snapshot to test (e.g., 'temperature.inside').
    comparison (str): The comparison operator as a string (e.g., '<', '>', '==', etc.).
    value (float/int): The value to compare against.

    Returns:
    bool: True if the condition is met, False otherwise.
    """
    # Access the nested attribute if needed
    attribute_value = snapshot
    for attr in variable.split("."):
        attribute_value = getattr(attribute_value, attr, None)
        if attribute_value is None:
            raise AttributeError(f"Attribute {variable} not found in the snapshot.")

    # Prepare the condition statement and evaluate it
    condition = f"{attribute_value} {comparison} {value}"
    return eval(condition)


def generate_key(snapshot: Snapshot, template: NotificationTemplate) -> str:
    return f"{template.id}_{snapshot.slug}"


class NotificationCheckHandler(ABC):
    def __init__(self):
        self._next_handler = None

    def set_next(self, handler):
        self._next_handler = handler
        return handler

    @abstractmethod
    async def handle(self, snapshot: Snapshot, template: NotificationTemplate) -> bool:
        """Process the notification check and decide whether to pass it along the chain."""
        logger.info(self.__str__())
        if self._next_handler:
            return await self._next_handler.handle(snapshot, template)
        return await self.announce(snapshot, template, True)

    async def announce(self, snapshot: Snapshot, template: NotificationTemplate, decision: bool) -> bool:
        """Handle the announcement of the decision."""
        if self._next_handler:
            return await self._next_handler.announce(snapshot, template, decision)
        return decision


class FinalDecisionHandler(NotificationCheckHandler):
    async def handle(self, snapshot, template) -> bool:
        # This handler is the last in the chain and will finalize the decision to True
        return await self.announce(snapshot, template, True)

    async def announce(self, snapshot, template, decision: bool) -> bool:
        # This is the final point of decision announcement. Implement necessary final adjustments or logging.
        logger.info(f"Final decision for snapshot {snapshot.id} on template {template.id}: {decision}")
        return decision


class ConditionEvaluator(NotificationCheckHandler):
    async def handle(self, snapshot, template) -> bool:
        logger.info("CONDITION")
        condition_met = evaluate_condition(snapshot, template.variable, template.comparison, template.value)
        if not condition_met:
            # Condition not met, make a negative announcement
            return await self.announce(snapshot, template, False)
        # Pass handling to the next checker
        return await super().handle(snapshot, template)


class NewErrorChecker(NotificationCheckHandler):
    def __init__(self):
        super().__init__()
        self.last_condition_met = {}  # Stores the last condition state by composite key

    async def handle(self, snapshot, template) -> bool:
        logger.info("NEWERROR")
        if not template.notify_new_error:
            return await super().handle(snapshot, template)

        key = generate_key(snapshot, template)
        condition_met = evaluate_condition(snapshot, template.variable, template.comparison, template.value)

        last = self.last_condition_met.get(key, False)

        if condition_met and not last:
            return await self.announce(snapshot, template, True)

        return await super().handle(snapshot, template)

    async def announce(self, snapshot, template, decision: bool) -> bool:
        key = generate_key(snapshot, template)
        self.last_condition_met[key] = decision
        return await super().announce(snapshot, template, decision)


def minutes_since(timestamp):
    timezone = "Europe/Prague"
    local_tz = pytz.timezone(timezone)
    # Convert input timestamp to Prague time
    local_input_time = timestamp.astimezone(local_tz)
    # Get the current time in Prague time
    current_time = datetime.now(local_tz)
    # Calculate the difference in minutes
    time_diff = current_time - local_input_time
    diff_minutes = time_diff.total_seconds() / 60

    return diff_minutes


class DelayChecker(NotificationCheckHandler):
    async def handle(self, snapshot, template) -> bool:
        logger.info("DELAY")
        if template.delay == 0:
            return await super().handle(snapshot, template)
        # Fetch the last notification time from the database
        latest_notifications = await notification_service.fetch_latest_notifications(template.id, snapshot.slug, 1)

        if len(latest_notifications) == 0:
            return await super().handle(snapshot, template)

        last_time = latest_notifications[0].timestamp
        minutes = minutes_since(last_time)
        if minutes < template.delay:
            return await self.announce(snapshot, template, False)

        return await super().handle(snapshot, template)


class StreakChecker(NotificationCheckHandler):
    def __init__(self):
        super().__init__()
        self.consecutive_counts = {}  # Stores consecutive counts by composite key

    async def handle(self, snapshot: Snapshot, template: NotificationTemplate):
        if template.streak == 0:
            return await super().handle(snapshot, template)
        key = generate_key(snapshot, template)
        condition_met = evaluate_condition(snapshot, template.variable, template.comparison, template.value)

        if condition_met:
            self.consecutive_counts[key] = self.consecutive_counts.get(key, 0) + 1
            if self.consecutive_counts.get(key, 0) >= template.streak:
                return await super().handle(snapshot, template)
            else:
                return await super().announce(snapshot, template, False)
        else:
            return await self.announce(snapshot, template, False)

    async def announce(self, snapshot, template, decision: bool) -> bool:
        key = generate_key(snapshot, template)
        if not decision:
            self.consecutive_counts[key] = 0
        else:
            self.consecutive_counts[key] = self.consecutive_counts.get(key, 0) + 1
        return await super().announce(snapshot, template, decision)
