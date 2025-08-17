# Development Setup Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+
- Node.js 18+ (for frontend)

### Initial Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd flowbus

# Start the development environment
docker-compose up -d

# The API will be available at http://localhost:8000
# Health check: http://localhost:8000/health
```

### Development Workflow

#### Backend Development
```bash
# Backend development (in backend/ directory)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend Development
```bash
# Frontend development (in frontend/ directory)
cd frontend
npm install
npm start
```

## Development Environment Components
- **Docker Compose**: API + PostgreSQL + Redis
- **GitHub Actions**: Continuous Integration
- **pytest**: Local test suite
- **FastAPI**: Backend API framework with automatic OpenAPI documentation

## Testing
- Local test suite available with pytest
- API testing scripts provided (test_api.py, test_api_curl.md)
- Health check endpoint for service validation

## Environment Configuration
- Development environment managed through Docker Compose
- Configuration files included for containerized deployment
- Separate development and production configurations
