from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

from app.core.database import db

router = APIRouter()


class HistoryCreate(BaseModel):
    user_id: str
    analysis_type: str
    title: str
    score: Optional[float] = None
    match_percentage: Optional[float] = None
    resume_id: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None


@router.post("/history")
async def create_history(data: HistoryCreate):
    if not data.user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required.")

    if not data.analysis_type.strip():
        raise HTTPException(status_code=400, detail="Analysis type is required.")

    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Title is required.")

    history_document = {
        "user_id": data.user_id,
        "analysis_type": data.analysis_type,
        "title": data.title,
        "score": data.score,
        "match_percentage": data.match_percentage,
        "resume_id": data.resume_id,
        "job_title": data.job_title,
        "summary": data.summary,
        "created_at": datetime.now(timezone.utc),
    }

    result = await db.analysis_history.insert_one(history_document)

    return {
        "success": True,
        "message": "Analysis history saved successfully",
        "history_id": str(result.inserted_id),
    }


@router.get("/history")
async def get_history(user_id: str):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="User ID is required.")

    records = await db.analysis_history.find(
        {"user_id": user_id}
    ).sort(
        "created_at", -1
    ).to_list(100)

    history = []

    for record in records:
        history.append({
            "id": str(record["_id"]),
            "user_id": record.get("user_id"),
            "analysis_type": record.get("analysis_type"),
            "title": record.get("title"),
            "score": record.get("score"),
            "match_percentage": record.get("match_percentage"),
            "resume_id": record.get("resume_id"),
            "job_title": record.get("job_title"),
            "summary": record.get("summary"),
            "created_at": record.get("created_at"),
        })

    return {
        "success": True,
        "history": history,
    }