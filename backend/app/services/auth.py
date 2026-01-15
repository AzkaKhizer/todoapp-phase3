"""Authentication service for Better Auth JWT verification.

Verifies JWT tokens issued by Better Auth using HS256 with shared secret.
Backend ONLY verifies JWTs - never creates them.
"""

from jose import jwt
from jose.exceptions import JWTError

from app.config import get_settings
from app.exceptions import AuthenticationError

settings = get_settings()

ALGORITHM = "HS256"


def verify_token(token: str) -> dict:
    """Verify a Better Auth JWT token and return the payload."""
    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[ALGORITHM],
            options={
                "verify_aud": False,
                "verify_iss": False,
            }
        )
        return payload
    except JWTError as e:
        raise AuthenticationError(f"Invalid token: {e}") from e


def get_user_id_from_token(token: str) -> str:
    """Extract user ID from JWT sub claim."""
    payload = verify_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError("Missing user ID in token")
    return str(user_id)
