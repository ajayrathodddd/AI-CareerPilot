from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.database import check_mongodb_connection
from app.api.practice import router as practice_router
from app.api.progress import router as progress_router
from app.api.auth import router as auth_router
from app.api.history import router as history_router
from app.api.history import router as history_router



app = FastAPI(
    title="AI CareerPilot API",
    description="AI-powered career development and job matching platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")
app.include_router(practice_router, prefix="/api/v1")
app.include_router(progress_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    mongodb_connected = await check_mongodb_connection()

    if mongodb_connected:
        print("✅ MongoDB connected successfully")
    else:
        print("❌ MongoDB connection failed")


@app.get("/")
def root():
    return {
        "message": "AI CareerPilot API is running",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "careerpilot-api",
        "environment": "development",
    }