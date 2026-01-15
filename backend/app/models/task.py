"""Task model for todo items."""

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, String
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """Task entity representing a todo item.

    Note: user_id is a string to support Better Auth's nanoid format.
    No foreign key relationship since users are managed by Better Auth.
    """

    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
    )
    title: str = Field(max_length=200)
    description: str = Field(default="", max_length=2000)
    is_complete: bool = Field(default=False)
    # Better Auth uses nanoid format for user IDs (not UUID)
    user_id: str = Field(
        sa_column=Column(String(64), index=True, nullable=False),
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime, nullable=False),
    )
