from datetime import datetime, timezone, timedelta
from os import getenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from ics import find_clashes, Interval
from typing import List
from config import CORS_ALLOW_ORIGINS, MONGO_URI
import traceback


# Create the FastAPI app only once
app = FastAPI()
#add_cors_middleware(app
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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


DEFAULT_QUERY_DAYS = 30

client = MongoClient(MONGO_URI, server_api=ServerApi("1"))

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


#  a root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the UEC API",
        "version": "1.0",
        "endpoints": {
            "events": "/events - Get events with optional ICS clash detection"
        },
        "status": {
            "database": "Connected" if client else "Not connected"
        }
    }

# Todo add response model
@app.get("/events")
def get_events(start_time: datetime = None, end_time: datetime = None, ics_url: str = None):
    try:
        now = datetime.now(timezone.utc)
        if start_time is None:
            start_time = now
        if end_time is None:
            end_time = start_time + timedelta(days=DEFAULT_QUERY_DAYS)
        
        # Add debug prints
        print(f"Querying events from {start_time} to {end_time}")
        print(f"MongoDB URI: {MONGO_URI}")
        
        # Check MongoDB connection
        try:
            client.admin.command('ping')
            print("MongoDB connection is working")
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
        
        # Query the events collection
        try:
            matches = list(events.find({
                'start_time': {'$gte': start_time},
                'end_time': {'$lte': end_time},
            }, {'_id': 0}))
            print(f"Found {len(matches)} matching events")
        except Exception as e:
            print(f"MongoDB query error: {e}")
            raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")
        
        # Process ICS URL if provided
        clashes = []
        if ics_url:
            try:
                print(f"Processing ICS URL: {ics_url}")
                clashes = find_clashes(ics_url)
                print(f"Found {len(clashes)} clashes")
            except Exception as e:
                print(f"Error processing ICS URL: {e}")
                print(traceback.format_exc())
                # Continue without clashes rather than failing
                clashes = []

        # Process and return events
        result_events = [
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
            if not event_clashes(e, clashes)
        ]
        
        print(f"Returning {len(result_events)} events after clash filtering")
        return {
            "events": result_events,
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")