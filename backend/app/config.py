import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://flowbus:flowbus_dev@localhost:5432/flowbus")
    
    # Redis Configuration
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    
    # Rate Limiting Configuration
    USER_RATE_LIMIT_PER_MINUTE: int = 60
    BLOCK_RATE_LIMIT_PER_MINUTE: int = 100
    
    class Config:
        env_file = ".env"


settings = Settings()
