#!/bin/bash

# FlowBus macOS Development Stop Script
# This script stops the FlowBus development environment

echo "🛑 Stopping FlowBus Development Environment"
echo "==========================================="

# Stop Docker services
echo "🐳 Stopping Docker services..."
docker-compose -f docker-compose.backend.yml down

echo "✅ FlowBus development environment stopped"
echo ""
echo "💡 To start again, run: ./start-dev-macos.sh"
