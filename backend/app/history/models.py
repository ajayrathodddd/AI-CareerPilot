from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AnalysisHistory(BaseModel):
    user_id: str
    analysis_type: str
    title: str
    score: Optional[float] = None
    match_percentage: Optional[float] = None
    resume_id: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)