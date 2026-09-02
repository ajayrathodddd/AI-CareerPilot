from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
from datetime import datetime, timezone
from bson import ObjectId
import shutil
import uuid

from app.services.resume_validator import validate_resume
from app.services.resume_parser import extract_text_from_pdf
from app.services.skill_extractor import extract_skills
from app.services.resume_cleaner import clean_resume_text
from app.services.job_matcher import match_resume_with_job
from app.services.ats_analyzer import calculate_ats_score
from app.core.database import db


router = APIRouter()

UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/status")
def api_status():
    return {
        "status": "online",
        "message": "CareerPilot API is ready"
    }


@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):

    allowed_extensions = {".pdf"}

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a resume PDF."
        )

    file_extension = Path(file.filename).suffix.lower()

    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF resume files are allowed."
        )

    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_text = extract_text_from_pdf(
            str(file_path)
        )

        cleaned_text = clean_resume_text(
            extracted_text
        )

        validation = validate_resume(
            cleaned_text
        )

        if not validation["valid"]:
            if file_path.exists():
                file_path.unlink()

            raise HTTPException(
                status_code=400,
                detail=validation["message"]
            )

        skills_analysis = extract_skills(
            cleaned_text
        )

        ats_analysis = calculate_ats_score(
            cleaned_text
        )

        resume_document = {
            "filename": file.filename,
            "stored_filename": unique_filename,
            "file_type": file_extension.replace(".", ""),
            "file_path": str(file_path),
            "text_length": len(extracted_text),
            "extracted_text": extracted_text,
            "cleaned_text": cleaned_text,
            "skills_analysis": skills_analysis,
            "ats_analysis": ats_analysis,
            "created_at": datetime.now(timezone.utc),
        }

        result = await db.resumes.insert_one(
            resume_document
        )

        return {
            "success": True,
            "message": "Resume uploaded, analyzed and saved to MongoDB successfully",
            "resume_id": str(result.inserted_id),
            "filename": file.filename,
            "stored_filename": unique_filename,
            "file_type": file_extension.replace(".", ""),
            "text_length": len(extracted_text),
            "skills_analysis": skills_analysis,
            "ats_analysis": ats_analysis,
        }

    except HTTPException:
        if file_path.exists():
            file_path.unlink()

        raise

    except Exception as error:
        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Could not process resume: {str(error)}"
        )

    finally:
        await file.close()


@router.post("/job/match")
async def match_job(
    resume_id: str,
    job_description: str,
):

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description is required."
        )

    if not ObjectId.is_valid(resume_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid resume ID."
        )

    try:
        resume = await db.resumes.find_one(
            {
                "_id": ObjectId(resume_id)
            }
        )

        if not resume:
            raise HTTPException(
                status_code=404,
                detail="Resume not found."
            )

        resume_skills = resume.get(
            "skills_analysis",
            {}
        ).get(
            "skills",
            []
        )

        match_result = match_resume_with_job(
            resume_skills,
            job_description,
        )

        match_document = {
            "resume_id": resume_id,
            "job_description": job_description,
            "match_result": match_result,
            "created_at": datetime.now(timezone.utc),
        }

        result = await db.job_matches.insert_one(
            match_document
        )

        return {
            "success": True,
            "match_id": str(result.inserted_id),
            "resume_id": resume_id,
            "match_result": match_result,
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not match resume with job: {str(error)}"
        )