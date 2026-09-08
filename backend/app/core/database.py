from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

MONGO_URI = settings.MONGODB_URI

client = AsyncIOMotorClient(MONGO_URI)

db = client[settings.MONGODB_DB]


async def check_mongodb_connection():
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {type(e).__name__}: {e}")
        return False