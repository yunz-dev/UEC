from datetime import date, datetime
from os import getenv

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class EventData(BaseModel):
    start_time: datetime
    end_time: datetime
    date: date
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


# Todo add response model
@app.get("/events")
def get_events(start_time: datetime = None, end_time: datetime = None):
    if start_time is None and end_time is None:
        raise HTTPException(
            status_code=422,
            detail="Only one of start_time and end_time can be null"
        )
    if end_time is None:
        matches = events.find({'start_time': {'$gte': start_time}}, {'_id': 0})
        return {"events": list(matches)}
    if start_time is None:
        matches = events.find({'end_time': {'$lte': end_time}}, {'_id': 0})
        return {"events": list(matches)}
    matches = events.find({'start_time': {'$gte': start_time}, 'end_time': {
                          '$lte': end_time}}, {'_id': 0})
    return {"events": list(matches)}
