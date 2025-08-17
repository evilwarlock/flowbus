# 🧪 FlowBus API Testing with cURL

## Base URL
```bash
BASE_URL="http://127.0.0.1:8000"
```

## 1. Health Check
```bash
curl -X GET "http://127.0.0.1:8000/health" \
  -H "Content-Type: application/json"
```

## 2. List All Blocks
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/blocks" \
  -H "Content-Type: application/json"
```

## 3. Get Specific Block
```bash
curl -X GET "http://127.0.0.1:8000/api/v1/blocks/demo-block-1" \
  -H "Content-Type: application/json"
```

## 4. User Registration
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123"
  }'
```

## 5. User Login
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword123"
```

## 6. Get Current User (Protected Endpoint)
```bash
# First, get the access token from login response
TOKEN="your_access_token_here"

curl -X GET "http://127.0.0.1:8000/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 🚀 Complete Test Sequence

### Step 1: Health Check
```bash
echo "Testing health endpoint..."
curl -X GET "http://127.0.0.1:8000/health"
echo -e "\n"
```

### Step 2: List Blocks
```bash
echo "Testing blocks endpoint..."
curl -X GET "http://127.0.0.1:8000/api/v1/blocks"
echo -e "\n"
```

### Step 3: Register User
```bash
echo "Testing user registration..."
curl -X POST "http://127.0.0.1:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpassword123"
  }'
echo -e "\n"
```

### Step 4: Login and Get Token
```bash
echo "Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "http://127.0.0.1:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword123")

echo "Login response: $LOGIN_RESPONSE"
echo -e "\n"
```

### Step 5: Test Protected Endpoint
```bash
echo "Testing protected endpoint..."
# Extract token from login response (you'll need to manually copy the token)
curl -X GET "http://127.0.0.1:8000/api/v1/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
echo -e "\n"
```

## 📋 PowerShell Commands (Windows)

### Health Check
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method GET
```

### List Blocks
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/blocks" -Method GET
```

### Register User
```powershell
$userData = @{
    email = "test@example.com"
    username = "testuser"
    password = "testpassword123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/register" -Method POST -Body $userData -ContentType "application/json"
```

### Login
```powershell
$loginData = "username=testuser&password=testpassword123"

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/x-www-form-urlencoded"
```

## 🎯 Expected Responses

### Health Check
```json
{
  "status": "healthy",
  "service": "flowbus-api"
}
```

### Blocks List
```json
{
  "blocks": [
    {
      "id": "demo-block-1",
      "name": "Text Summarizer",
      "description": "Summarizes long text using AI",
      "price_per_call": 0.01,
      "owner": "demo-user"
    },
    {
      "id": "demo-block-2",
      "name": "Image Analyzer", 
      "description": "Analyzes images and extracts information",
      "price_per_call": 0.05,
      "owner": "demo-user"
    }
  ]
}
```

### Login Response
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

## 🔧 Troubleshooting

### If you get connection errors:
1. Make sure the API server is running: `python backend/main.py`
2. Check the port: `http://127.0.0.1:8000`
3. Verify the server started without errors

### If you get authentication errors:
1. Make sure you registered the user first
2. Copy the exact token from the login response
3. Include the "Bearer " prefix in the Authorization header 