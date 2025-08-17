# Authentication Module Documentation

## Overview

The FlowBus authentication system provides secure user management, JWT-based authentication, and protected route functionality. This module enables users to register, login, and access protected platform features.

## Implementation Status: ✅ Complete

### Features Implemented

- **User Registration**: Secure account creation with email/username validation
- **Password Security**: Bcrypt hashing with salt for password storage
- **JWT Authentication**: Stateless token-based authentication with configurable expiration
- **Protected Routes**: FastAPI dependency system for route protection
- **User Management**: Complete CRUD operations for user accounts

## API Endpoints

### Public Endpoints
- `POST /api/v1/users/` - User registration
- `POST /api/v1/auth/login` - User login (returns JWT token)

### Protected Endpoints
- `GET /api/v1/auth/me` - Get current user information
- `GET /api/v1/users/me` - Alternative current user endpoint
- `GET /api/v1/users/{user_id}` - Get user by ID

## Technical Architecture

### Components

1. **Security Module** (`app/security.py`)
   - Password hashing and verification
   - JWT token creation and validation
   - Authentication dependencies

2. **User Models** (`app/models.py`)
   - SQLAlchemy User model with relationships
   - Database schema for user data

3. **Schemas** (`app/schemas.py`)
   - Pydantic models for request/response validation
   - User creation, response, and token schemas

4. **Routers**
   - `app/routers/auth.py` - Authentication endpoints
   - `app/routers/users.py` - User management endpoints

### Configuration

Environment variables (configurable via `.env`):
- `SECRET_KEY` - JWT signing key
- `ALGORITHM` - JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (30 minutes default)

### Security Features

- **Password Hashing**: Bcrypt with automatic salt generation
- **JWT Tokens**: HS256 signing with configurable expiration
- **Input Validation**: Comprehensive validation via Pydantic
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Duplicate Prevention**: Email and username uniqueness constraints

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT uuid_v4(),
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships
- Users have many Blocks (one-to-many)
- Users have many Invocations (one-to-many)

## Usage Examples

### User Registration
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "testuser",
    "password": "securepassword123"
  }'
```

### User Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=securepassword123"
```

### Accessing Protected Endpoints
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

### Automated Tests
- **Integration Test**: `tests/integration/test_auth_implementation.py`
- **Coverage**: Registration, login, protected access, error handling

### Test Scenarios
- ✅ User registration with validation
- ✅ Successful login with valid credentials
- ✅ JWT token generation and validation
- ✅ Protected endpoint access with valid token
- ✅ Unauthorized access rejection
- ✅ Invalid credentials handling
- ✅ Duplicate user prevention

## Error Handling

### HTTP Status Codes
- `200 OK` - Successful operations
- `201 Created` - User registration success
- `400 Bad Request` - Validation errors, duplicate users
- `401 Unauthorized` - Invalid credentials, missing/invalid tokens
- `404 Not Found` - User not found

### Common Error Responses
```json
{
  "detail": "A user with this email already exists"
}
```

## Development Guidelines

### Adding New Protected Endpoints
```python
from app.security import get_current_user

@router.get("/protected-endpoint")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.username}
```

### Password Requirements
- Stored as bcrypt hashes
- No minimum length enforced (can be added)
- Salt automatically generated

### Token Management
- Tokens expire after 30 minutes (configurable)
- No refresh token mechanism (can be added)
- Stateless - no server-side token storage

## Future Enhancements

Potential improvements for future iterations:
- Refresh token mechanism
- Password reset functionality
- Email verification
- OAuth integration (Google, GitHub, etc.)
- Role-based access control (RBAC)
- Account lockout after failed attempts
- Password strength requirements
