from app.core.database import db
from app.models.notification import (
    NotificationTemplate,
)  # Import the correct model
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)


async def insert_template(template: NotificationTemplate):
    """Inserts a new notification template into the database."""
    result = await db.client[db.db_name]["notification_templates"].insert_one(template.model_dump(by_alias=True))
    logger.info(f"Created NotificationTemplate with ID: {result.inserted_id}")
    return result.inserted_id


async def find_templates_by_scope(scope: str, global_flag: bool = True):
    """Finds notification templates by scope, optionally including global templates."""
    query: dict = {"scope": scope}
    if global_flag:
        query = {"$or": [{"scope": scope}, {"scope": "global"}]}

    cursor = db.client[db.db_name]["notification_templates"].find(query)
    logger.info(cursor)
    templates = []
    try:
        async for document in cursor:
            templates.append(NotificationTemplate(**document))
    except Exception as err:
        logger.error(err)
    return templates


async def fetch_template_by_id(template_id: str):
    """Fetches a notification template by its ID from the database."""
    document = await db.client[db.db_name]["notification_templates"].find_one({"_id": ObjectId(template_id)})
    if document:
        return NotificationTemplate(**document)
    return None


async def fetch_all_templates():
    """Fetches all notification templates from the database."""
    cursor = db.client[db.db_name]["notification_templates"].find({})
    templates = []
    async for document in cursor:
        templates.append(NotificationTemplate(**document))
    return templates


async def update_template(id: str, template: NotificationTemplate):
    """Updates an existing notification template."""
    result = await db.client[db.db_name]["notification_templates"].update_one(
        {"_id": ObjectId(id)},
        {"$set": template.model_dump(exclude={"id"}, by_alias=True)},
    )
    return result.matched_count


async def delete_template(template_id: str):
    """Deletes a template by its ID."""
    id = ObjectId(template_id)
    result = await db.client[db.db_name]["notification_templates"].delete_one({"_id": id})
    if result.deleted_count == 0:
        return False
    await db.client[db.db_name]["notifications"].delete_many({"template": id})
    return True
