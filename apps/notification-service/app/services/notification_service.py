from app.core.database import db
from app.models.mongo import PyObjectId
from app.models.notification import Notification
import logging
from bson import ObjectId
from datetime import datetime, timedelta
import pytz


logger = logging.getLogger(__name__)


async def fetch_all_notifications():
    """Fetches all notifications from the database."""
    cursor = db.client[db.db_name]["notifications"].find({})
    notifications = []
    async for document in cursor:
        # Convert BSON ObjectId to string for Pydantic compatibility
        notifications.append(Notification(**document))
    return notifications


async def find_notifications_by_template_slug(
    slug: str,
    from_date: datetime = (datetime.now(pytz.timezone("Europe/Prague")) - timedelta(days=30)).replace(
        hour=0, minute=0, second=0, microsecond=0
    ),
    to_date: datetime = datetime.now(pytz.timezone("Europe/Prague")).replace(
        hour=23, minute=59, second=59, microsecond=999999
    ),
):
    """Finds all notifications linked to a notification template with a given slug."""
    query = {"slug": slug, "timestamp": {"$gte": from_date, "$lte": to_date}}

    cursor = db.client[db.db_name]["notifications"].find(query)
    notifications = []
    async for document in cursor:
        notifications.append(Notification(**document))
    return notifications


async def create_notification(template_id: str, slug: str, timestamp: datetime = datetime.now()):
    """Creates a new notification for a given template ID with a specified timestamp."""

    # Verify that the template ID exists
    template_exists = await db.client[db.db_name]["notification_templates"].find_one({"_id": ObjectId(template_id)})
    if not template_exists:
        logger.error(f"No template found with ID: {template_id}")
        raise ValueError("Template ID does not exist")

    # Create the notification
    notification = Notification(template=PyObjectId(template_id), slug=slug, timestamp=timestamp)
    result = await db.client[db.db_name]["notifications"].insert_one(notification.model_dump(by_alias=True))
    logger.info(f"Created Notification with ID: {result.inserted_id}")
    return result.inserted_id


async def delete_notification(notification_id: str):
    """Deletes a notification by its ID."""
    result = await db.client[db.db_name]["notifications"].delete_one({"_id": ObjectId(notification_id)})
    if result.deleted_count == 0:
        logger.info(f"No notification found with ID: {notification_id}")
        return False  # Indicate that no document was deleted
    logger.info(f"Deleted notification with ID: {notification_id}")
    return True  # Indicate successful deletion
