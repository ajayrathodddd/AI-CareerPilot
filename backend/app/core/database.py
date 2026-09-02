from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"
)

client = AsyncIOMotorClient(MONGO_URI)

db = client["ai_careerpilot_new"]


async def check_mongodb_connection():
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False