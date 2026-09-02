
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone

from app.core.database import db

router = APIRouter(prefix="/progress", tags=["Learning Progress"])


class ProgressRequest(BaseModel):
    user_id: str
    skill: str
    lesson_index: int
    lesson_completed: bool = False
    practice_completed: bool = False
    quiz_passed: bool = False

@router.get("/{user_id}")
async def get_progress(user_id: str):
    collection = db["learning_progress"]

    records = await collection.find(
        {"user_id": user_id}
    ).to_list(length=1000)

    for record in records:
        record["_id"] = str(record["_id"])

    return {
        "success": True,
        "user_id": user_id,
        "progress": records,
    }


@router.post("/save")
async def save_progress(request: ProgressRequest):
    collection = db["learning_progress"]

    progress_data = {
        "user_id": request.user_id,
        "skill": request.skill,
        "lesson_index": request.lesson_index,
        "lesson_completed": request.lesson_completed,
        "practice_completed": request.practice_completed,
        "quiz_passed": request.quiz_passed,
        "updated_at": datetime.now(timezone.utc),
    }

    await collection.update_one(
        {
            "user_id": request.user_id,
            "skill": request.skill,
            "lesson_index": request.lesson_index,
        },
        {
            "$set": progress_data,
        },
        upsert=True,
    )

    return {
        "success": True,
        "message": "Learning progress saved successfully.",
        "progress": progress_data,
    }


@router.delete("/{user_id}")
async def delete_progress(user_id: str):
    collection = db["learning_progress"]

    result = await collection.delete_many(
        {"user_id": user_id}
    )

    return {
        "success": True,
        "message": "Learning progress reset successfully.",
        "deleted_count": result.deleted_count,
    }

