# Frontend Directory Fix

## Problem
The original `docker-compose.yml` file included a `frontend` service that references a `./frontend` directory that doesn't exist yet, causing the error:

```
unable to prepare context: path "/Users/yuzheng/Funspace/flowbus/frontend" not found
```

## Solution
Created a separate `docker-compose.backend.yml` file that only includes the backend services:
- PostgreSQL database
- Redis cache

## Files Created/Modified

### New Files:
- `docker-compose.backend.yml` - Backend-only services
- `stop-dev-macos.sh` - Convenience script to stop services

### Modified Files:
- `start-dev-macos.sh` - Updated to use backend-only compose file
- `doc/setup/macos_setup_guide.md` - Updated instructions

## Usage

### Start Development Environment:
```bash
./start-dev-macos.sh
```

### Or manually:
```bash
docker-compose -f docker-compose.backend.yml up -d
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Stop Services:
```bash
./stop-dev-macos.sh
```

### Or manually:
```bash
docker-compose -f docker-compose.backend.yml down
```

## Future Frontend Integration
When we add the React frontend later, we can:
1. Create the `frontend/` directory
2. Use the original `docker-compose.yml` file
3. Add frontend build configuration

The current setup allows backend development without waiting for frontend implementation.
