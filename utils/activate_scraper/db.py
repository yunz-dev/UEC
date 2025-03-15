from datetime import datetime

from bson.objectid import ObjectId
from model import EventData
from pymongo import MongoClient


def get_db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["app"]
    return db


def add_event(event_data):
    db = get_db()
    result = db.events.insert_one(event_data)
    return str(result.inserted_id)


def upsert_event(event_data: EventData):
    db = get_db()
    event_dict = event_data.dict()

    event_dict["updated_at"] = datetime.utcnow()

    result = db.events.update_one(
        {
            "date": event_data.date,
            "summary": event_data.summary,
            "description": event_data.description,
        },
        {"$set": event_dict},
        upsert=True,
    )

    if result.upserted_id:
        return f"Inserted new event with ID: {result.upserted_id}"
    elif result.modified_count > 0:
        return "Updated existing event successfully."
    else:
        return "No changes made."


def get_all_events():
    db = get_db()
    return list(db.events.find())


def get_event_by_id(event_id):
    db = get_db()
    return db.events.find_one({"_id": ObjectId(event_id)})


def add_or_update_event(event_data):
    db = get_db()
    result = db.events.update_one(
        {
            "title": event_data["title"],
            "date": event_data["date"],
            "start_time": event_data["start_time"],
        },
        {"$set": event_data},
        upsert=True,
    )
    return "Inserted" if result.upserted_id else "Updated"


def update_event(event_id, update_data):
    db = get_db()
    result = db.events.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
    return result.modified_count > 0


def delete_event(event_id):
    db = get_db()
    result = db.events.delete_one({"_id": ObjectId(event_id)})


if __name__ == "__main__":
    event_id = add_event(
        {"name": "Tech Conference", "date": "2025-05-10", "location": "Sydney"}
    )
    print("Added Event ID:", event_id)

    print("All Events:", get_all_events())

    print("Single Event:", get_event_by_id(event_id))

    update_success = update_event(event_id, {"location": "Melbourne"})
    print("Update Successful:", update_success)

    delete_success = delete_event(event_id)
    print("Delete Successful:", delete_success)
