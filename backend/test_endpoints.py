#!/usr/bin/env python3
"""
Test script for FlowBus API endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_blocks():
    """Test the blocks endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/api/v1/blocks")
        print(f"✅ Blocks endpoint: {response.status_code}")
        data = response.json()
        print(f"   Found {len(data.get('blocks', []))} blocks")
        return True
    except Exception as e:
        print(f"❌ Blocks endpoint failed: {e}")
        return False

def test_auth_endpoints():
    """Test authentication endpoints"""
    try:
        # Test registration endpoint
        user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpassword123"
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
        print(f"✅ Registration endpoint: {response.status_code}")
        
        # Test login endpoint
        login_data = {
            "username": "testuser",
            "password": "testpassword123"
        }
        
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", data=login_data)
        print(f"✅ Login endpoint: {response.status_code}")
        
        return True
    except Exception as e:
        print(f"❌ Auth endpoints failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing FlowBus API Endpoints")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Blocks Endpoint", test_blocks),
        ("Auth Endpoints", test_auth_endpoints),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🧪 Testing {test_name}...")
        if test_func():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your API is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the API server.")

if __name__ == "__main__":
    main() 