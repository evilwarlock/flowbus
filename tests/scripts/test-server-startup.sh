#!/bin/bash

# Quick test to check if the FastAPI server can start without errors
# This script tests the import and basic startup

echo "🧪 Testing FastAPI Server Startup"
echo "=================================="

cd backend

# Check if virtual environment exists and activate it
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Run ./start-dev-macos.sh first."
    exit 1
fi

source venv/bin/activate

echo "📋 Testing Python imports..."

# Test if all imports work
python3 -c "
try:
    from app.models import User, Block, Invocation, BillingLog, RevenueSplit
    print('✅ Models import successfully')
    
    from app.schemas import UserCreate, UserResponse, Token, BlockCreate, BlockResponse
    print('✅ Schemas import successfully')
    
    from app.database import get_db, create_tables
    print('✅ Database module imports successfully')
    
    from app.security import get_password_hash, verify_password, create_access_token
    print('✅ Security module imports successfully')
    
    from app.routers import auth, users, blocks
    print('✅ Routers import successfully')
    
    import main
    print('✅ Main module imports successfully')
    
    print('')
    print('🎉 All imports successful! Server should start without errors.')
    
except Exception as e:
    print(f'❌ Import error: {e}')
    exit(1)
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Ready to start server! Run:"
    echo "   uvicorn main:app --reload"
    echo ""
    echo "Or use the full startup script:"
    echo "   ./start-dev-macos.sh"
else
    echo ""
    echo "❌ There are still import issues. Check the error above."
fi
