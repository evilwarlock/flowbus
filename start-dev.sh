#!/bin/bash

echo "🚀 Starting FlowBus Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start the services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if API is responding
echo "🔍 Checking API health..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ API is running at http://localhost:8000"
    echo "📊 Health check: http://localhost:8000/health"
    echo "📚 API docs: http://localhost:8000/docs"
else
    echo "⚠️  API might still be starting up. Try again in a few seconds."
fi

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📁 Project structure:"
echo "  - Backend API: http://localhost:8000"
echo "  - Database: localhost:5432"
echo "  - Redis: localhost:6379"
echo ""
echo "🔧 Next steps:"
echo "  1. Check the API docs at http://localhost:8000/docs"
echo "  2. Start building your first block!"
echo "  3. Run 'docker-compose logs -f api' to see API logs"
echo ""
echo "🛑 To stop: docker-compose down" 