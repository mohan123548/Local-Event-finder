from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EventBase(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    city: str | None = Field(default=None, max_length=120)
    venue: str | None = Field(default=None, max_length=200)
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    image_url: str | None = Field(default=None, max_length=500)
    source_url: str | None = Field(default=None, max_length=500)
    organizer: str | None = Field(default=None, max_length=200)


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    category: str | None = Field(default=None, max_length=100)
    city: str | None = Field(default=None, max_length=120)
    venue: str | None = Field(default=None, max_length=200)
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)
    image_url: str | None = Field(default=None, max_length=500)
    source_url: str | None = Field(default=None, max_length=500)
    organizer: str | None = Field(default=None, max_length=200)


class EventRead(EventBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class EventList(BaseModel):
    total: int
    skip: int
    limit: int
    items: list[EventRead]
