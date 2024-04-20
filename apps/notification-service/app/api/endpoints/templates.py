from fastapi import APIRouter, HTTPException, Body, Depends, Query, Path
from app.api.dependencies import get_current_user
from app.models.mongo import PyObjectId
from app.models.notification import NotificationTemplate
from app.services import template_service
from typing import List

router = APIRouter()


@router.get("/", response_model=List[NotificationTemplate])
async def list_templates(_=Depends(get_current_user)):
    templates = await template_service.fetch_all_templates()
    return templates


@router.get("/{slug}", response_model=List[NotificationTemplate])
async def get_templates(
    slug: str,
    global_flag: bool = Query(True, alias="global"),
    _=Depends(get_current_user),
):
    templates = await template_service.find_templates_by_scope(slug, global_flag)
    if not templates:
        return []
    return templates


@router.post("/", response_model=NotificationTemplate)
async def create_template(template_data: NotificationTemplate = Body(...), _=Depends(get_current_user)):
    template_id = await template_service.insert_template(template_data)
    template = NotificationTemplate(_id=template_id, **template_data.model_dump())
    return template


@router.put("/{id}", response_model=NotificationTemplate)
async def update_template(
    id: str = Path(..., title="The ID of the template to delete"),
    template_data: NotificationTemplate = Body(...),
    _=Depends(get_current_user),
):
    updated_count = await template_service.update_template(id, template_data)
    if not updated_count:
        raise HTTPException(
            status_code=404,
            detail="NotificationTemplate not updated - it may not exist",
        )
    return NotificationTemplate(_id=PyObjectId(id), **template_data.model_dump())


@router.delete("/{id}", status_code=200)
async def delete_template(
    id: str = Path(..., title="The ID of the template to delete"),
    _=Depends(get_current_user),
):
    matched_count = await template_service.delete_template(id)
    if matched_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully", "success": True}
