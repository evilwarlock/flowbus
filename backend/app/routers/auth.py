from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import UserCreate, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["authentication"])

# Mock user storage for testing
mock_users = {}

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    """Register a new user (mock implementation)"""
    if user.username in mock_users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username already exists"
        )
    
    # Mock user creation
    mock_user = {
        "id": f"user_{len(mock_users) + 1}",
        "email": user.email,
        "username": user.username,
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    }
    
    mock_users[user.username] = {
        "user": mock_user,
        "password": user.password  # In real app, this would be hashed
    }
    
    return mock_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and return access token (mock implementation)"""
    if form_data.username not in mock_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    stored_user = mock_users[form_data.username]
    if form_data.password != stored_user["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Mock token generation
    access_token = f"mock_token_{form_data.username}_{len(mock_users)}"
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_current_user_info():
    """Get current user information (mock implementation)"""
    # For now, return a mock user
    return {
        "id": "user_1",
        "email": "test@example.com",
        "username": "testuser",
        "is_active": True,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
    } 