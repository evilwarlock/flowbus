# Auth Module Implementation Plan

## 1. Objective
The goal of this plan is to transition the current mock authentication system to a production-ready, database-backed authentication and authorization system using JWT.

## 2. Current State
The existing authentication router at `backend/app/routers/auth.py` uses an in-memory dictionary (`mock_users`) to simulate user registration and login. It does not perform password hashing or generate proper JWTs. The user endpoints are not connected to the SQLAlchemy models or the database.

## 3. Proposed Architecture
The new implementation will consist of the following components:
- **Database Integration**: User creation and retrieval will be handled through SQLAlchemy sessions, interacting with the `users` table defined in `app/models.py`.
- **Password Hashing**: We will use `passlib` with the `bcrypt` algorithm to securely hash and verify user passwords. Passwords will never be stored in plaintext.
- **JWT-based Authentication**: Upon successful login, the system will generate a JWT access token containing the user's identifier (`user_id`).
- **Protected Routes**: A FastAPI dependency will be created to verify the JWT from the `Authorization` header and retrieve the current authenticated user. This dependency will be used to protect sensitive endpoints.
- **Router Refactoring**: The existing auth logic will be cleaned up, and a new router for user-related operations (like creation) will be added.

## 4. Task Breakdown

### Task 1: Setup Hashing and JWT Utilities
- **File**: `backend/app/auth.py` (or a new `security.py` file).
- **Details**:
    - Create a `pwd_context` using `passlib.context.CryptContext` for password hashing (`bcrypt`).
    - Implement functions:
        - `get_password_hash(password: str) -> str`: Hashes a plaintext password.
        - `verify_password(plain_password: str, hashed_password: str) -> bool`: Verifies a plaintext password against a hash.
    - Implement JWT functions:
        - `create_access_token(data: dict, expires_delta: timedelta = None) -> str`: Creates a JWT.
        - A corresponding function to decode and verify the token will be part of the dependency in Task 4.
- **Configuration**: Add `SECRET_KEY`, `ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES` to a configuration file (e.g., `.env` file, to be created).

### Task 2: Implement User Creation Logic
- **File**: `backend/app/routers/users.py` (new file).
- **Details**:
    - Create a new router `APIRouter(prefix="/users", tags=["users"])`.
    - Implement a `POST /` endpoint for user registration.
    - It will accept `UserCreate` schema.
    - It should call `get_password_hash` to hash the user's password before storing it in the database.
    - It should handle potential database errors, such as a user with the same email or username already existing.
    - Return a `UserResponse`.
- **Dependencies**: This will require database session dependency.

### Task 3: Implement Login Endpoint
- **File**: `backend/app/routers/auth.py` (refactor).
- **Details**:
    - Modify the `POST /login` endpoint.
    - It will take `OAuth2PasswordRequestForm = Depends()`.
    - Authenticate the user by fetching them from the database and using `verify_password`.
    - If authentication is successful, generate a JWT using `create_access_token`.
    - Return a `Token` schema containing the `access_token` and `token_type`.
    - Handle authentication failures with appropriate HTTP exceptions.

### Task 4: Implement Dependency for Protected Routes
- **File**: `backend/app/auth.py` (or where JWT utils are).
- **Details**:
    - Create an `oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")`.
    - Create a dependency function `get_current_user(token: str = Depends(oauth2_scheme))`.
    - This function will:
        1. Decode the JWT.
        2. Extract the user identifier (e.g., username or user ID).
        3. Fetch the user from the database.
        4. Handle token expiration, invalid signatures, and cases where the user doesn't exist.
        5. Return the user object.

### Task 5: Create Protected "Me" Endpoint
- **File**: `backend/app/routers/auth.py` (refactor).
- **Details**:
    - Refactor the `GET /me` endpoint.
    - It will depend on `get_current_user`.
    - It will simply return the user object provided by the dependency.
    - This serves as a test case for the authentication system.

### Task 6: Refactor `main.py`
- **File**: `backend/main.py`.
- **Details**:
    - Include the new users router: `app.include_router(users.router, prefix="/api/v1")`.
    - Move the placeholder `/blocks` endpoints from `main.py` to a new file `backend/app/routers/blocks.py`. This will be implemented after auth is complete, but we can move the placeholders now to clean up `main.py`.

## 5. Open Questions & Considerations
- **JWT Token Expiry**: What should be the lifetime of an access token? (e.g., 30 minutes, 1 hour).
- **Refresh Tokens**: Should we implement a refresh token mechanism for longer-lived sessions? This adds complexity but improves user experience and security.
- **Password Policy**: Should we enforce a password policy (e.g., minimum length, complexity)? This would be implemented during user registration.
- **Configuration Management**: Where should secrets like `SECRET_KEY` be stored? A `.env` file is a common approach for development.

This detailed plan provides a clear path forward. Once you approve this, we can consider the design ready for implementation.
