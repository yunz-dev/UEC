from datetime import date, datetime

from pydantic import BaseModel


class EventData(BaseModel):
    start_time: datetime
    end_time: datetime
    cost: int
    category: list[str]
    summary: str
    description: str
    link: str
    updated_at: datetime
    location: str


class CalendarData(BaseModel):
    DTSTART: datetime
    DTEND: datetime
    SUMMARY: str
    DESCRIPTION: str
    LOCATION: str
