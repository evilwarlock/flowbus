Write-Host "🚀 Starting FlowBus Development Environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Start the services
Write-Host "📦 Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if API is responding
Write-Host "🔍 Checking API health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API is running at http://localhost:8000" -ForegroundColor Green
        Write-Host "📊 Health check: http://localhost:8000/health" -ForegroundColor Cyan
        Write-Host "📚 API docs: http://localhost:8000/docs" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  API might still be starting up. Try again in a few seconds." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Project structure:" -ForegroundColor Cyan
Write-Host "  - Backend API: http://localhost:8000"
Write-Host "  - Database: localhost:5432"
Write-Host "  - Redis: localhost:6379"
Write-Host ""
Write-Host "🔧 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check the API docs at http://localhost:8000/docs"
Write-Host "  2. Start building your first block!"
Write-Host "  3. Run 'docker-compose logs -f api' to see API logs"
Write-Host ""
Write-Host "🛑 To stop: docker-compose down" -ForegroundColor Red 