import requests
from icalendar import Calendar
from datetime import datetime, timedelta

from pydantic import BaseModel
from typing import List


MAX_INTERVAL_DAYS = 30


class Interval(BaseModel):
    start: datetime
    end: datetime


def merge_intervals(intervals: List[List[datetime]]) -> List[List[datetime]]:
    if len(intervals) < 2:
        return intervals
    intervals.sort()
    res = []
    cur = None
    for i in intervals:
        if cur is None:
            cur = i
            continue
        if i[0] > cur[1]:
            res.append(cur)
            cur = i
        elif i[1] > cur[1]:
            cur[1] = i[1]
    return res + [cur]


def find_clashes(ics_link: str) -> List[Interval]:
    res = requests.get(ics_link)
    if res.status_code != 200:
        return []
    content = res.content.decode()
    cal: Calendar = Calendar.from_ical(content)
    intervals = []
    max_end = None
    for event in cal.walk('VEVENT'):
        start: datetime = event.get("DTSTART").dt
        end = event.get("DTEND").dt
        day = start.replace(hour=0, minute=0, second=0, microsecond=0)
        if max_end is None:
            today = datetime.now().date()
            max_end = day.replace(
                year=today.year, month=today.month, day=today.day)
            max_end += timedelta(days=MAX_INTERVAL_DAYS)
        if day > max_end:
            continue
        intervals.append([start, end])
    all_intervals = merge_intervals(intervals)
    return [Interval(start=s, end=e) for s, e in all_intervals]
