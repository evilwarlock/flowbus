# FlowBus API Testing Script for Windows PowerShell

Write-Host "🧪 Testing FlowBus API Endpoints" -ForegroundColor Green
Write-Host "=" * 50

$baseUrl = "http://127.0.0.1:8000"

# Test 1: Health Check
Write-Host "`n1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: List Blocks
Write-Host "`n2. Testing Blocks Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/blocks" -Method GET
    Write-Host "✅ Blocks Endpoint: Found $($response.blocks.Count) blocks" -ForegroundColor Green
} catch {
    Write-Host "❌ Blocks Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: User Registration
Write-Host "`n3. Testing User Registration..." -ForegroundColor Yellow
try {
    $userData = @{
        email = "test@example.com"
        username = "testuser"
        password = "testpassword123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "✅ User Registration: User created with ID $($response.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ User Registration Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: User Login
Write-Host "`n4. Testing User Login..." -ForegroundColor Yellow
try {
    $loginData = "username=testuser&password=testpassword123"
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginData -ContentType "application/x-www-form-urlencoded"
    Write-Host "✅ User Login: Token received" -ForegroundColor Green
    
    # Store token for next test
    $token = $response.access_token
    Write-Host "   Token: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ User Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    $token = $null
}

# Test 5: Protected Endpoint (if we have a token)
if ($token) {
    Write-Host "`n5. Testing Protected Endpoint..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/me" -Method GET -Headers $headers
        Write-Host "✅ Protected Endpoint: User $($response.username) authenticated" -ForegroundColor Green
    } catch {
        Write-Host "❌ Protected Endpoint Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n5. Skipping Protected Endpoint (no token available)" -ForegroundColor Yellow
}

Write-Host "`n" + "=" * 50
Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check the API docs at: $baseUrl/docs" -ForegroundColor White
Write-Host "2. Start building block management features" -ForegroundColor White
Write-Host "3. Add payment processing with Stripe" -ForegroundColor White 