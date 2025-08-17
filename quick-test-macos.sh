#!/bin/bash

# Enhanced Quick Test Script for FlowBus on macOS
# This script performs comprehensive API testing including authentication flow

echo "🧪 Enhanced FlowBus API Test"
echo "============================"

# Function to test URL with both localhost and 127.0.0.1
test_endpoint() {
    local endpoint="$1"
    local description="$2"
    
    if curl -s --max-time 5 "http://127.0.0.1:8000$endpoint" > /dev/null 2>&1; then
        echo "✅ $description (http://127.0.0.1:8000$endpoint)"
        return 0
    elif curl -s --max-time 5 "http://localhost:8000$endpoint" > /dev/null 2>&1; then
        echo "✅ $description (http://localhost:8000$endpoint)"
        return 0
    else
        echo "❌ $description - not responding"
        return 1
    fi
}

# Determine which base URL works
BASE_URL=""
echo "🔍 Detecting server address..."
if curl -s --max-time 3 http://127.0.0.1:8000/health > /dev/null 2>&1; then
    BASE_URL="http://127.0.0.1:8000"
    echo "✅ Server detected at $BASE_URL"
elif curl -s --max-time 3 http://localhost:8000/health > /dev/null 2>&1; then
    BASE_URL="http://localhost:8000"
    echo "✅ Server detected at $BASE_URL"
else
    echo "❌ API is not responding on port 8000"
    echo ""
    echo "💡 To start the server:"
    echo "   ./start-dev-macos.sh"
    echo "   OR manually: cd backend && source venv/bin/activate && uvicorn main:app --reload"
    exit 1
fi

echo ""
echo "1. Testing Core Endpoints"
echo "========================="

# Test health endpoint
echo "Health Check:"
if response=$(curl -s --max-time 5 "$BASE_URL/health" 2>/dev/null); then
    echo "✅ Health endpoint working"
    echo "   Response: $response"
else
    echo "❌ Health endpoint failed"
fi

# Test root endpoint
echo ""
echo "Root Endpoint:"
if response=$(curl -s --max-time 5 "$BASE_URL/" 2>/dev/null); then
    echo "✅ Root endpoint working"
    echo "   Response: $response"
else
    echo "❌ Root endpoint failed"
fi

# Test API documentation
echo ""
echo "2. Testing API Documentation"
echo "============================"
if curl -s --max-time 5 "$BASE_URL/docs" > /dev/null 2>&1; then
    echo "✅ Interactive API docs: $BASE_URL/docs"
else
    echo "❌ API documentation not available"
fi

if curl -s --max-time 5 "$BASE_URL/openapi.json" > /dev/null 2>&1; then
    echo "✅ OpenAPI spec: $BASE_URL/openapi.json"
else
    echo "❌ OpenAPI spec not available"
fi

echo ""
echo "3. Testing Authentication Flow"
echo "============================="

# Generate unique test user
TIMESTAMP=$(date +%s)
TEST_USER="testuser$TIMESTAMP"
TEST_EMAIL="test$TIMESTAMP@flowbus.com"
TEST_PASSWORD="testpass123"

echo "Creating test user: $TEST_USER"

# Test user registration
echo "📝 Testing user registration..."
REGISTER_RESPONSE=$(curl -s --max-time 10 -X POST "$BASE_URL/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"username\": \"$TEST_USER\",
    \"password\": \"$TEST_PASSWORD\"
  }" 2>/dev/null)

if echo "$REGISTER_RESPONSE" | grep -q "id"; then
    echo "✅ User registration successful"
    USER_ID=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "unknown")
    echo "   User ID: $USER_ID"
else
    echo "❌ User registration failed"
    echo "   Response: $REGISTER_RESPONSE"
fi

# Test user login
echo ""
echo "🔐 Testing user login..."
LOGIN_RESPONSE=$(curl -s --max-time 10 -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$TEST_USER&password=$TEST_PASSWORD" 2>/dev/null)

if echo "$LOGIN_RESPONSE" | grep -q "access_token"; then
    echo "✅ User login successful"
    ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)
    echo "   Token (first 20 chars): ${ACCESS_TOKEN:0:20}..."
    
    # Test protected endpoint
    echo ""
    echo "🛡️  Testing protected endpoint..."
    ME_RESPONSE=$(curl -s --max-time 10 -X GET "$BASE_URL/api/v1/auth/me" \
      -H "Authorization: Bearer $ACCESS_TOKEN" 2>/dev/null)
    
    if echo "$ME_RESPONSE" | grep -q "$TEST_USER"; then
        echo "✅ Protected endpoint access successful"
        echo "   User info retrieved for: $TEST_USER"
    else
        echo "❌ Protected endpoint access failed"
        echo "   Response: $ME_RESPONSE"
    fi
    
    # Test protected block endpoint
    echo ""
    echo "🧱 Testing protected block creation..."
    BLOCK_RESPONSE=$(curl -s --max-time 10 -X POST "$BASE_URL/api/v1/blocks/" \
      -H "Authorization: Bearer $ACCESS_TOKEN" 2>/dev/null)
    
    if echo "$BLOCK_RESPONSE" | grep -q "message"; then
        echo "✅ Protected block endpoint accessible"
        echo "   Response: $BLOCK_RESPONSE"
    else
        echo "❌ Protected block endpoint failed"
    fi
    
else
    echo "❌ User login failed"
    echo "   Response: $LOGIN_RESPONSE"
fi

# Test unauthorized access
echo ""
echo "🚫 Testing unauthorized access..."
UNAUTH_RESPONSE=$(curl -s --max-time 5 -X GET "$BASE_URL/api/v1/auth/me" 2>/dev/null)
if echo "$UNAUTH_RESPONSE" | grep -q "401\|Unauthorized\|Not authenticated"; then
    echo "✅ Unauthorized access properly rejected"
else
    echo "⚠️  Unauthorized access test unclear"
    echo "   Response: $UNAUTH_RESPONSE"
fi

echo ""
echo "4. Testing Public Endpoints"
echo "=========================="

# Test blocks listing
echo "📋 Testing blocks listing..."
if curl -s --max-time 5 "$BASE_URL/api/v1/blocks/" > /dev/null 2>&1; then
    echo "✅ Blocks listing endpoint working"
else
    echo "❌ Blocks listing endpoint failed"
fi

echo ""
echo "5. Summary"
echo "=========="
echo "🌐 Server running at: $BASE_URL"
echo "📚 API Documentation: $BASE_URL/docs"
echo "🔗 Available endpoints:"
echo "   • Root: $BASE_URL/"
echo "   • Health: $BASE_URL/health"
echo "   • User Registration: POST $BASE_URL/api/v1/users/"
echo "   • User Login: POST $BASE_URL/api/v1/auth/login"
echo "   • User Info: GET $BASE_URL/api/v1/auth/me (protected)"
echo "   • Blocks: GET/POST $BASE_URL/api/v1/blocks/"

echo ""
echo "🎉 Enhanced test completed!"
echo ""
echo "💡 Next steps:"
echo "   • Visit $BASE_URL/docs for interactive API testing"
echo "   • Run full test: cd backend && python test_auth_implementation.py"
echo "   • Check logs: docker-compose -f docker-compose.backend.yml logs"
