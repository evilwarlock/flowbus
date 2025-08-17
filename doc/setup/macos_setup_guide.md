# FlowBus macOS Setup Guide

## Prerequisites

### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Required Software

#### Install Python 3.11+
```bash
brew install python@3.11
# Verify installation
python3 --version
```

#### Install PostgreSQL
```bash
brew install postgresql@14
brew services start postgresql@14

# Create database and user
psql postgres
```

In PostgreSQL shell, run:
```sql
CREATE DATABASE flowbus;
CREATE USER flowbus WITH ENCRYPTED PASSWORD 'flowbus_dev';
GRANT ALL PRIVILEGES ON DATABASE flowbus TO flowbus;
ALTER USER flowbus CREATEDB;
\q
```

#### Install Docker (Alternative to local PostgreSQL)
```bash
brew install --cask docker
```
Start Docker Desktop from Applications.

### 3. Install Node.js (for future frontend development)
```bash
brew install node@18
# Verify installation
node --version
npm --version
```

## Quick Start Options

### Option 1: Docker Compose (Recommended)
This is the easiest way to get started as it handles all dependencies.

```bash
# Start backend services only (PostgreSQL + Redis)
docker-compose -f docker-compose.backend.yml up -d

# Check if services are running
docker-compose -f docker-compose.backend.yml ps

# The database will be available at localhost:5432
# Redis will be available at localhost:6379

# To stop services later
docker-compose -f docker-compose.backend.yml down
```

**Note**: We use `docker-compose.backend.yml` instead of the main `docker-compose.yml` because the frontend directory doesn't exist yet. The main docker-compose file will be used later when we add the React frontend.

### Option 2: Local Development Setup

#### Step 1: Set up Python Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

#### Step 2: Configure Environment Variables
```bash
# Create .env file in backend directory
cat > .env << EOF
SECRET_KEY=your-secret-key-change-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://flowbus:flowbus_dev@localhost:5432/flowbus
EOF
```

#### Step 3: Start the Application
```bash
# Make sure you're in the backend directory with venv activated
cd backend
source venv/bin/activate

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Testing the Installation

### Method 1: Using the Test Script
```bash
# In a new terminal, navigate to backend directory
cd backend

# Make sure requests is installed
pip install requests

# Run the authentication test
python test_auth_implementation.py
```

### Method 2: Manual API Testing

#### Check Health Endpoint
```bash
curl http://localhost:8000/health
```

#### Register a New User
```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123"
  }'
```

#### Login and Get Token
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword123"
```

#### Access Protected Endpoint
```bash
# Replace YOUR_TOKEN with the access_token from login response
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Method 3: Interactive API Documentation
Visit http://localhost:8000/docs in your browser to access the interactive Swagger UI.

## Common Issues and Solutions

### Issue 1: Python 3.13 Compatibility Error
**Error**: `pydantic-core` build failure or `ForwardRef._evaluate()` missing argument

**Cause**: Python 3.13 is too new for some packages in requirements.txt

**Solutions**:
```bash
# Option 1: Use the automatic fix script (Recommended)
./fix-python313-compatibility.sh

# Option 2: Install Python 3.11 manually
brew install python@3.11
cd backend
rm -rf venv
/usr/local/bin/python3.11 -m venv venv  # or /opt/homebrew/bin/python3.11
source venv/bin/activate
pip install -r requirements.txt

# Option 3: Use compatible packages for Python 3.13
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements-py313.txt
```

### Issue 2: psycopg2-binary Installation Error
**Error**: `pg_config executable not found` or `psycopg2-binary` build failure

**Solution**:
```bash
# Install PostgreSQL development libraries
brew install postgresql@14

# Add to PATH (for current session)
export PATH="/usr/local/opt/postgresql@14/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Add to shell config (permanent fix)
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc

# Restart terminal or source config
source ~/.zshrc

# Or use the fix script
./fix-psycopg2-macos.sh
```

### Issue 3: PostgreSQL Connection Error
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if not running
brew services start postgresql@14

# Test database connection
psql -h localhost -U flowbus -d flowbus
```

### Issue 4: Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port
uvicorn main:app --reload --port 8001
```

### Issue 5: Virtual Environment Issues
```bash
# Deactivate current environment
deactivate

# Remove and recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Issue 6: Docker Issues
```bash
# Stop all containers
docker-compose -f docker-compose.backend.yml down

# Remove containers and volumes
docker-compose -f docker-compose.backend.yml down -v

# Rebuild and restart
docker-compose -f docker-compose.backend.yml up -d --build
```

## Development Workflow

### Starting Development Session
```bash
# Option 1: Using Docker (Recommended)
docker-compose -f docker-compose.backend.yml up -d
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Option 2: Using the automated script
./start-dev-macos.sh

# Option 3: Local setup only
cd backend
source venv/bin/activate
# Make sure PostgreSQL is running locally
uvicorn main:app --reload
```

### Stopping Services
```bash
# Stop FastAPI server: Ctrl+C in terminal

# Stop Docker services
docker-compose -f docker-compose.backend.yml down
# Or use the stop script
./stop-dev-macos.sh

# Stop local PostgreSQL
brew services stop postgresql@14
```

## Next Steps

1. **API is running**: http://localhost:8000
2. **API Documentation**: http://localhost:8000/docs
3. **Health Check**: http://localhost:8000/health
4. **Test the authentication**: Run `python test_auth_implementation.py`

Your FlowBus backend is now ready for development on macOS! 🚀
