from fastapi import Header, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
import os

security = HTTPBearer()


def get_jwt_secret_key() -> str:
    return os.getenv("JWT_SECRET", "")


async def get_current_user(
    authorization: HTTPAuthorizationCredentials = Security(security),
) -> dict:
    token = authorization.credentials
    try:
        payload = jwt.decode(token, get_jwt_secret_key(), algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=403,
            detail="Could not validate credentials",
        )
