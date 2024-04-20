from fastapi import APIRouter, Query, Depends, HTTPException, Path
from app.api.dependencies import get_current_user
from app.models.mongo import PyObjectId
from app.models.notification import Notification
from app.services import notification_service
from typing import List
from datetime import datetime, timedelta
import pytz

router = APIRouter()


@router.get("/", response_model=List[Notification])
async def get_all_notifications(_=Depends(get_current_user)):
    """
    Retrieves all notifications from the database.
    """
    notifications = await notification_service.fetch_all_notifications()
    return notifications


@router.get("/{slug}", response_model=List[Notification])
async def get_notifications(
    slug: str,
    global_flag: bool = Query(True, alias="global"),
    start: str = Query(None, description="Start date (YYYY-MM-DD)"),
    end: str = Query(None, description="End date (YYYY-MM-DD)"),
    _=Depends(get_current_user),
):
    prague_timezone = pytz.timezone("Europe/Prague")
    if start:
        from_date = prague_timezone.localize(datetime.strptime(start, "%Y-%m-%d"))
        from_date = from_date.replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        from_date = datetime.now(prague_timezone) - timedelta(days=30)
        from_date = from_date.replace(hour=0, minute=0, second=0, microsecond=0)

    if end:
        to_date = prague_timezone.localize(datetime.strptime(end, "%Y-%m-%d"))
        to_date = to_date.replace(hour=23, minute=59, second=59, microsecond=999999)
    else:
        to_date = datetime.now(prague_timezone)
        to_date = to_date.replace(hour=23, minute=59, second=59, microsecond=999999)

    notifications = await notification_service.find_notifications_by_template_slug(
        slug, global_flag, from_date, to_date
    )
    if not notifications:
        return []
    return notifications


@router.post("/{template_id}", response_model=Notification)
async def create_notification(
    template_id: str = Path(..., description="The ID of the template to create a notification for"),
    _=Depends(get_current_user),
):
    """
    Creates a new notification based on the provided template ID.
    The timestamp is set to the current server time by default.
    """
    try:
        now = datetime.now()
        notification_id = await notification_service.create_notification(template_id, now)
        notification = Notification(_id=notification_id, template=PyObjectId(template_id), timestamp=now)
        return notification
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{id}", status_code=204)
async def delete_notification(
    id: str = Path(..., title="The ID of the notification to delete"),
    _=Depends(get_current_user),
):
    """
    Deletes a notification based on the provided ID.
    """
    success = await notification_service.delete_notification(id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted successfully"}
