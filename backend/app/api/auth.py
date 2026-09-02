from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import db
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.user import (
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

security = HTTPBearer()


def user_response(user):
    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        email=user["email"],
    )


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register(request: UserCreate):
    collection = db["users"]

    existing_email = await collection.find_one(
        {"email": request.email.lower()}
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )

    existing_username = await collection.find_one(
        {"username": request.username}
    )

    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken.",
        )

    user = {
        "username": request.username,
        "email": request.email.lower(),
        "password": hash_password(request.password),
    }

    result = await collection.insert_one(user)

    user["_id"] = result.inserted_id

    token = create_access_token(str(user["_id"]))

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_response(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(request: UserLogin):
    collection = db["users"]

    user = await collection.find_one(
        {"email": request.email.lower()}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        request.password,
        user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token(str(user["_id"]))

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user_response(user),
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        payload = decode_access_token(
            credentials.credentials
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
        )

    collection = db["users"]

    from bson import ObjectId

    try:
        user = await collection.find_one(
            {"_id": ObjectId(user_id)}
        )
    except Exception:
        user = None

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found.",
        )

    return user


@router.get(
    "/me",
    response_model=UserResponse,
)
async def get_me(
    current_user=Depends(get_current_user),
):
    return user_response(current_user)