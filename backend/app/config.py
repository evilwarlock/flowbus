import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://flowbus:flowbus_dev@localhost:5432/flowbus")
    
    class Config:
        env_file = ".env"


settings = Settings()
