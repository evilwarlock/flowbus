#!/bin/bash

# FlowBus macOS Development Startup Script
# This script helps you quickly start the FlowBus development environment on macOS

set -e  # Exit on any error

echo "🚀 Starting FlowBus Development Environment on macOS"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the flowbus project root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker Desktop for macOS"
    echo "   Visit: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+"
    echo "   Run: brew install python@3.11"
    exit 1
fi

# Check for PostgreSQL development libraries (needed for psycopg2)
if ! command_exists pg_config; then
    echo "⚠️  PostgreSQL development libraries not found. Installing..."
    if command_exists brew; then
        brew install postgresql@14
        echo "✅ PostgreSQL development libraries installed"
        
        # Add PostgreSQL binaries to PATH for this session
        export PATH="/usr/local/opt/postgresql@14/bin:$PATH"
        export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
    else
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
fi

echo "✅ Prerequisites check passed"

# Start Docker services
echo ""
echo "🐳 Starting Docker services (PostgreSQL + Redis)..."
docker-compose -f docker-compose.backend.yml up -d

# Wait a moment for services to start
sleep 5

# Check if services are running
echo "📊 Checking Docker services status..."
docker-compose -f docker-compose.backend.yml ps

# Set up Python environment
echo ""
echo "🐍 Setting up Python environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Check Python version and install appropriate dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip

PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "Detected Python version: $PYTHON_VERSION"

if [[ "$PYTHON_VERSION" == "3.13" ]]; then
    echo "⚠️  Using Python 3.13 - installing compatible packages..."
    if [[ -f "requirements-py313.txt" ]]; then
        pip install -r requirements-py313.txt
    else
        echo "❌ requirements-py313.txt not found. Using standard requirements..."
        pip install -r requirements.txt
    fi
else
    echo "✅ Using Python $PYTHON_VERSION - installing standard packages..."
    pip install -r requirements.txt
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
SECRET_KEY=dev-secret-key-change-in-production-$(openssl rand -hex 16)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://flowbus:flowbus_dev@localhost:5432/flowbus
EOF
    echo "✅ Created .env file with development settings"
fi

echo ""
echo "🎉 Setup complete! Starting FastAPI server..."
echo ""
echo "📝 Useful URLs:"
echo "   • API: http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo "   • Health Check: http://localhost:8000/health"
echo ""
echo "🧪 To test the authentication:"
echo "   python test_auth_implementation.py"
echo ""
echo "⏹️  To stop: Press Ctrl+C, then run 'docker-compose -f docker-compose.backend.yml down'"
echo "=================================================="
echo ""

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
