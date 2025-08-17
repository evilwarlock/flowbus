#!/usr/bin/env python3
"""
Simple test script to verify the FlowBus project structure
"""

import json
import os
from pathlib import Path

def test_project_structure():
    """Test that all required files and directories exist"""
    print("🔍 Testing FlowBus project structure...")
    
    # Check if required directories exist
    required_dirs = [
        "backend",
        "backend/app",
    ]
    
    for dir_path in required_dirs:
        if os.path.exists(dir_path):
            print(f"✅ {dir_path}/ exists")
        else:
            print(f"❌ {dir_path}/ missing")
    
    # Check if required files exist
    required_files = [
        "docker-compose.yml",
        "backend/main.py",
        "backend/requirements.txt",
        "backend/Dockerfile",
        "backend/app/models.py",
        "backend/app/schemas.py",
        "backend/app/database.py",
        ".gitignore",
        "README.md"
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} missing")
    
    print("\n📁 Current project structure:")
    for root, dirs, files in os.walk("."):
        level = root.replace(".", "").count(os.sep)
        indent = " " * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = " " * 2 * (level + 1)
        for file in files:
            if not file.startswith(".") and not file.endswith(".pyc"):
                print(f"{subindent}{file}")

def test_python_environment():
    """Test Python environment"""
    print("\n🐍 Testing Python environment...")
    
    import sys
    print(f"✅ Python version: {sys.version}")
    
    # Test basic imports
    try:
        import json
        print("✅ json module available")
    except ImportError:
        print("❌ json module not available")
    
    try:
        import pathlib
        print("✅ pathlib module available")
    except ImportError:
        print("❌ pathlib module not available")

def main():
    """Main test function"""
    print("🚀 FlowBus Project Test")
    print("=" * 50)
    
    test_project_structure()
    test_python_environment()
    
    print("\n" + "=" * 50)
    print("📋 Next Steps:")
    print("1. Install Docker Desktop for Windows")
    print("2. Run: docker-compose up -d")
    print("3. Or install Python dependencies: pip install fastapi uvicorn")
    print("4. Start the API: python backend/main.py")
    print("\n🎯 Your MVP is ready to build!")

if __name__ == "__main__":
    main() 