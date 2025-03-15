import re
import urllib.parse
from datetime import datetime
from typing import Dict

from model import CalendarData, EventData


def extract_event_data(calendar_str: str) -> CalendarData:
    if calendar_str.startswith("data:text/calendar;charset=utf8,"):
        calendar_str = calendar_str[len("data:text/calendar;charset=utf8,") :]

    decoded_text = urllib.parse.unquote(calendar_str)

    event_data = {}

    patterns = {
        "start_time": r"DTSTART:(\d+T\d+Z)",
        "end_time": r"DTEND:(\d+T\d+Z)",
        "summary": r"SUMMARY:(.+)",
        "description": r"DESCRIPTION:(.+)",
        "location": r"LOCATION:(.+)",
    }

    for key, pattern in patterns.items():
        match = re.search(pattern, decoded_text)
        if match:
            event_data[key] = match.group(1).strip()

    if "start_time" in event_data:
        event_data["start_time"] = datetime.strptime(
            event_data["start_time"], "%Y%m%dT%H%M%SZ"
        )
    if "end_time" in event_data:
        event_data["end_time"] = datetime.strptime(
            event_data["end_time"], "%Y%m%dT%H%M%SZ"
        )

    return event_data


def event_adapter(cal_data: CalendarData, url: str) -> EventData:
    return EventData(
        start_time=cal_data["start_time"],
        end_time=cal_data["end_time"],
        cost=0,
        category=[],
        summary=cal_data["summary"],
        description=cal_data["description"],
        link=url,
        updated_at=datetime.utcnow(),
        location=cal_data["location"],
    )
