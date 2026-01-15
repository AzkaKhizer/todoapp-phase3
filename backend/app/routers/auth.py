"""Authentication endpoints.

Registration and login are now handled by Better Auth on the frontend.
This router provides endpoints for getting current user info and logout.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies.auth import get_current_user_id
from app.schemas.auth import MessageResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_410_GONE)
async def register() -> dict:
    """Registration is now handled by Better Auth.

    Use the frontend /api/auth/sign-up endpoint instead.
    """
    raise HTTPException(
        status_code=status.HTTP_410_GONE,
        detail="Registration is now handled by Better Auth. Use the frontend authentication."
    )


@router.post("/login", status_code=status.HTTP_410_GONE)
async def login() -> dict:
    """Login is now handled by Better Auth.

    Use the frontend /api/auth/sign-in endpoint instead.
    """
    raise HTTPException(
        status_code=status.HTTP_410_GONE,
        detail="Login is now handled by Better Auth. Use the frontend authentication."
    )


@router.post("/logout", response_model=MessageResponse)
async def logout() -> MessageResponse:
    """Logout endpoint for API completeness.

    Better Auth handles session management, so this is a no-op.
    The frontend should call the Better Auth signOut method.
    """
    return MessageResponse(message="Use Better Auth signOut on the frontend")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    user_id: str = Depends(get_current_user_id),
) -> UserResponse:
    """Get the current authenticated user's information from the JWT.

    This extracts user info directly from the Better Auth JWT token.
    """
    # For now, we return minimal info from the JWT
    # The user_id is a UUID string from Better Auth
    return UserResponse(
        id=user_id,
        email="",  # Email may not be in all tokens
        created_at="",  # Not available from JWT
    )
