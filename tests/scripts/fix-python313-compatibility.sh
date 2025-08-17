#!/bin/bash

# Fix Python 3.13 compatibility issues for FlowBus
# This script provides multiple solutions for Python 3.13 compatibility

echo "🐍 Python 3.13 Compatibility Fix for FlowBus"
echo "============================================="

# Check current Python version
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
echo "Current Python version: $PYTHON_VERSION"

echo ""
echo "🔧 Available Solutions:"
echo ""
echo "Option 1: Install Python 3.11 or 3.12 (Recommended)"
echo "Option 2: Use Python 3.13 with compatible packages"
echo "Option 3: Use precompiled wheels (fallback)"
echo ""

read -p "Which option would you like to try? (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Installing Python 3.11 via Homebrew..."
        brew install python@3.11
        
        echo "🔧 Setting up Python 3.11 environment..."
        
        # Remove existing venv if it exists
        if [ -d "backend/venv" ]; then
            echo "Removing existing virtual environment..."
            rm -rf backend/venv
        fi
        
        cd backend
        
        # Create new venv with Python 3.11
        /usr/local/bin/python3.11 -m venv venv 2>/dev/null || /opt/homebrew/bin/python3.11 -m venv venv
        
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
        
        echo "✅ Python 3.11 environment set up successfully!"
        echo "To use this environment, run: cd backend && source venv/bin/activate"
        ;;
    2)
        echo ""
        echo "🔧 Using Python 3.13 with compatible packages..."
        
        cd backend
        
        # Remove existing venv if it exists
        if [ -d "venv" ]; then
            echo "Removing existing virtual environment..."
            rm -rf venv
        fi
        
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        
        # Install packages individually to handle errors
        echo "Installing FastAPI and core dependencies..."
        pip install fastapi==0.108.0
        pip install uvicorn[standard]==0.25.0
        pip install sqlalchemy==2.0.25
        
        echo "Installing database and auth dependencies..."
        pip install psycopg2-binary==2.9.9
        pip install python-jose[cryptography]==3.3.0
        pip install passlib[bcrypt]==1.7.4
        
        echo "Installing remaining dependencies..."
        pip install redis==5.0.1
        pip install python-multipart==0.0.6
        pip install httpx==0.26.0
        pip install pytest==7.4.4
        
        # Try to install pydantic with specific version
        echo "Installing Pydantic (might need to build from source)..."
        pip install pydantic==2.6.0 pydantic-settings==2.1.0
        
        echo "✅ Python 3.13 compatible packages installed!"
        ;;
    3)
        echo ""
        echo "🔧 Using precompiled wheels and pip constraints..."
        
        cd backend
        
        if [ -d "venv" ]; then
            echo "Removing existing virtual environment..."
            rm -rf venv
        fi
        
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        
        # Use pip with no-cache and only-binary to avoid building from source
        echo "Installing packages with precompiled wheels only..."
        pip install --only-binary=all --no-cache-dir fastapi uvicorn sqlalchemy
        pip install --only-binary=all --no-cache-dir psycopg2-binary
        pip install --only-binary=all --no-cache-dir python-jose passlib
        pip install --only-binary=all --no-cache-dir redis python-multipart httpx pytest
        
        # For pydantic, try to install an older compatible version
        pip install --only-binary=all --no-cache-dir "pydantic<2.5" "pydantic-settings<2.1"
        
        echo "✅ Precompiled packages installed!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

echo ""
echo "🚀 Next steps:"
echo "1. Try running: ./start-dev-macos.sh"
echo "2. Or manually: cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo ""
echo "If you still have issues, consider using Python 3.11 for the most stable experience."
