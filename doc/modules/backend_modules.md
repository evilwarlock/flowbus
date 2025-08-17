# Backend Modules (FastAPI)

## Module Overview
The FlowBus backend is built with FastAPI and consists of the following core modules:

## Core API Modules

### `/blocks` Module
- **Purpose**: CRUD API for block upload and search
- **Functionality**:
  - Block creation and metadata management
  - Block discovery and search
  - Block listing and filtering
  - Owner dashboard functionality

### `/invoke/{block_id}` Module
- **Purpose**: API proxy + usage tracker
- **Functionality**:
  - Proxy requests to external block APIs
  - Track usage and invocation metrics
  - Handle authentication and authorization
  - Rate limiting and quota management

### `/billing` Module
- **Purpose**: Revenue aggregation
- **Functionality**:
  - Usage-based billing calculations
  - Revenue tracking and reporting
  - Payment processing integration
  - Revenue sharing logic

### `/auth` Module
- **Purpose**: JWT-based user identity
- **Functionality**:
  - User authentication and authorization
  - JWT token management
  - OAuth2 integration
  - Session management

## Database Integration
- SQLAlchemy ORM models
- Pydantic schemas for API validation
- Database configuration and connection management

## Supporting Components
- **models.py**: SQLAlchemy database models
- **schemas.py**: Pydantic request/response schemas
- **database.py**: Database configuration and session management
- **main.py**: FastAPI application entry point
