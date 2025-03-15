from datetime import datetime, timezone
from os import getenv

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from ics import find_clashes, Interval
from typing import List


class EventData(BaseModel):
    start_time: datetime
    end_time: datetime
    cost: int
    category: list[str]
    summary: str
    description: str
    link: str
    location: str


class CalendarData(BaseModel):
    DTSTART: datetime
    DTEND: datetime
    SUMMARY: str
    DESCRIPTION: str
    LOCATION: str


app = FastAPI()
client = MongoClient(getenv("MONGO_URI"), server_api=ServerApi("1"))

try:
    client.admin.command("ping")
    print("Connected to MongoDB!")
except Exception as e:
    print(e)

db = client["app"]
events = db["events"]
users = db["users"]


def event_clashes(event: dict, clashes: List[Interval]):
    for clash in clashes:
        s = clash.start.astimezone(timezone.utc).replace(tzinfo=None)
        e = clash.end.astimezone(timezone.utc).replace(tzinfo=None)
        if event["start_time"] < e and s < event["end_time"]:
            return True
    return False


# Todo add response model
@app.get("/events")
def get_events(start_time: datetime = None, end_time: datetime = None, ics_url: str = None):
    if start_time is None and end_time is None:
        raise HTTPException(
            status_code=422,
            detail="Only one of start_time and end_time can be null"
        )
    if end_time is None:
        matches = events.find({'start_time': {'$gte': start_time}}, {'_id': 0})
    elif start_time is None:
        matches = events.find({'end_time': {'$lte': end_time}}, {'_id': 0})
    else:
        matches = events.find({
            'start_time': {'$gte': start_time},
            'end_time': {'$lte': end_time},
        }, {'_id': 0})
    clashes = find_clashes(ics_url) if ics_url else []

    return {
        "events": [
            EventData(
                start_time=e.get("start_time"),
                end_time=e.get("end_time"),
                cost=e.get("cost"),
                category=e.get("category"),
                summary=e.get("summary"),
                description=e.get("description"),
                link=e.get("link"),
                location=e.get("location")
            )
            for e in matches
            if not event_clashes(
                e,
                clashes
            )
        ],
    }
