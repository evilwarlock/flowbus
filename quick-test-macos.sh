#!/bin/bash

# Quick Test Script for FlowBus on macOS
# This script performs a quick health check of the running FlowBus API

echo "🧪 Quick FlowBus API Test"
echo "========================"

# Check if API is running
echo "1. Testing API connection..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ API is running on http://localhost:8000"
else
    echo "❌ API is not responding. Make sure it's running with ./start-dev-macos.sh"
    exit 1
fi

# Test health endpoint
echo ""
echo "2. Health Check Response:"
curl -s http://localhost:8000/health | python3 -m json.tool

# Test API documentation availability
echo ""
echo "3. Testing API documentation..."
if curl -s http://localhost:8000/docs > /dev/null; then
    echo "✅ API documentation available at http://localhost:8000/docs"
else
    echo "❌ API documentation not available"
fi

echo ""
echo "4. Available endpoints:"
echo "   • API Root: http://localhost:8000/"
echo "   • Health: http://localhost:8000/health"
echo "   • API Docs: http://localhost:8000/docs"
echo "   • User Registration: POST http://localhost:8000/api/v1/users/"
echo "   • User Login: POST http://localhost:8000/api/v1/auth/login"
echo "   • Protected User Info: GET http://localhost:8000/api/v1/auth/me"

echo ""
echo "🎉 Quick test completed!"
echo ""
echo "To run the full authentication test:"
echo "   cd backend && python test_auth_implementation.py"
