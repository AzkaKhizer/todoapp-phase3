"""Environment configuration for the Todo backend application."""

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self):
        db_url = os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://localhost/todo"
        )
        # Convert postgresql:// to postgresql+asyncpg:// for async support
        if db_url.startswith("postgresql://"):
            db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        # Remove sslmode query param as asyncpg handles SSL via connect_args
        if "?sslmode=" in db_url:
            db_url = db_url.split("?sslmode=")[0]
        elif "&sslmode=" in db_url:
            db_url = db_url.replace("&sslmode=require", "").replace("&sslmode=prefer", "")
        self.database_url: str = db_url
        # Better Auth shared secret for JWT verification (HS256)
        # CRITICAL: Must match frontend BETTER_AUTH_SECRET exactly
        # Falls back to JWT_SECRET for backward compatibility
        self.better_auth_secret: str = os.getenv(
            "BETTER_AUTH_SECRET",
            os.getenv("JWT_SECRET", "dev-secret-key-change-in-production")
        )
        # Better Auth frontend URL (for reference only)
        self.better_auth_url: str = os.getenv(
            "BETTER_AUTH_URL",
            "http://localhost:3000"
        )
        self.jwt_expiry_hours: int = int(os.getenv("JWT_EXPIRY_HOURS", "24"))
        cors_env = os.getenv("CORS_ORIGINS", "*")
        if cors_env == "*":
            self.cors_origins: list[str] = ["*"]
        else:
            self.cors_origins: list[str] = cors_env.split(",")


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
