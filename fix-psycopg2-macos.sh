#!/bin/bash

# Quick fix for psycopg2-binary installation issues on macOS
# This script installs the PostgreSQL development libraries needed for psycopg2

echo "🔧 Fixing psycopg2-binary installation issue on macOS"
echo "===================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Homebrew is installed
if ! command_exists brew; then
    echo "❌ Homebrew is required but not installed."
    echo "Please install Homebrew first:"
    echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

# Install PostgreSQL development libraries
echo "📦 Installing PostgreSQL development libraries..."
brew install postgresql@14

# Add PostgreSQL binaries to PATH
echo "🔧 Setting up PATH..."
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc

# For current session
export PATH="/usr/local/opt/postgresql@14/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Verify pg_config is available
if command_exists pg_config; then
    echo "✅ pg_config is now available: $(which pg_config)"
else
    echo "⚠️  pg_config still not found. You may need to restart your terminal."
    echo "Then source your shell config: source ~/.zshrc"
fi

echo ""
echo "🚀 Now try running the setup again:"
echo "   ./start-dev-macos.sh"
echo ""
echo "Or manually install dependencies:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   pip install -r requirements.txt"
