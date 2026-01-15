"""Task endpoints for CRUD operations."""

import uuid

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.dependencies.auth import get_current_user_id
from app.schemas.auth import MessageResponse
from app.schemas.task import (
    TaskCreate,
    TaskListResponse,
    TaskPatch,
    TaskResponse,
    TaskUpdate,
)
from app.services import task as task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=TaskListResponse)
async def list_tasks(
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskListResponse:
    """List all tasks for the current user."""
    tasks, total = await task_service.get_tasks(
        session, user_id, limit, offset
    )
    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=total,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Create a new task."""
    task = await task_service.create_task(session, user_id, data)
    return TaskResponse.model_validate(task)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Get a specific task."""
    task = await task_service.get_task_by_id(session, task_id, user_id)
    return TaskResponse.model_validate(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: uuid.UUID,
    data: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Full update of a task."""
    task = await task_service.update_task(session, task_id, user_id, data)
    return TaskResponse.model_validate(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def patch_task(
    task_id: uuid.UUID,
    data: TaskPatch,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Partial update of a task."""
    task = await task_service.patch_task(session, task_id, user_id, data)
    return TaskResponse.model_validate(task)


@router.delete("/{task_id}", response_model=MessageResponse)
async def delete_task(
    task_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    """Delete a task."""
    await task_service.delete_task(session, task_id, user_id)
    return MessageResponse(message="Task deleted successfully")


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> TaskResponse:
    """Toggle task completion status."""
    task = await task_service.toggle_task(session, task_id, user_id)
    return TaskResponse.model_validate(task)
