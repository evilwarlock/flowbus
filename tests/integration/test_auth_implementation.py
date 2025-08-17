#!/usr/bin/env python3
"""
Test script for the new authentication implementation.
This script tests user registration, login, and accessing protected endpoints.
"""

import requests
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_auth_flow():
    """Test the complete authentication flow."""
    print("🚀 Testing FlowBus Authentication Implementation")
    print("=" * 50)
    
    # Test health check
    print("\n1. Testing health check...")
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running on http://localhost:8000?")
        return
    
    # Test user registration
    print("\n2. Testing user registration...")
    user_data = {
        "email": "test@flowbus.com",
        "username": "testuser",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/", json=user_data)
        if response.status_code == 201:
            user_info = response.json()
            print(f"✅ User registration successful: {user_info['username']} ({user_info['email']})")
        elif response.status_code == 400:
            print("ℹ️ User might already exist, continuing with login test...")
        else:
            print(f"❌ User registration failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ User registration error: {e}")
        return
    
    # Test user login
    print("\n3. Testing user login...")
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login", 
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        if response.status_code == 200:
            token_info = response.json()
            access_token = token_info["access_token"]
            print(f"✅ Login successful, token type: {token_info['token_type']}")
            print(f"   Token (first 20 chars): {access_token[:20]}...")
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test protected endpoint (/auth/me)
    print("\n4. Testing protected endpoint (/auth/me)...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ Protected endpoint access successful")
            print(f"   User: {user_info['username']} ({user_info['email']})")
            print(f"   Active: {user_info['is_active']}")
        else:
            print(f"❌ Protected endpoint access failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Protected endpoint error: {e}")
    
    # Test protected endpoint (/users/me)
    print("\n5. Testing another protected endpoint (/users/me)...")
    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        if response.status_code == 200:
            user_info = response.json()
            print(f"✅ Users/me endpoint access successful")
            print(f"   User ID: {user_info['id']}")
        else:
            print(f"❌ Users/me endpoint access failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Users/me endpoint error: {e}")
    
    # Test protected block creation endpoint
    print("\n6. Testing protected block creation endpoint...")
    try:
        response = requests.post(f"{BASE_URL}/blocks/", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Protected block endpoint access successful")
            print(f"   Response: {result['message']}")
        else:
            print(f"❌ Protected block endpoint access failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Protected block endpoint error: {e}")
    
    # Test unauthorized access
    print("\n7. Testing unauthorized access...")
    try:
        response = requests.get(f"{BASE_URL}/auth/me")
        if response.status_code == 401:
            print("✅ Unauthorized access properly rejected")
        else:
            print(f"❌ Unauthorized access should be rejected: {response.status_code}")
    except Exception as e:
        print(f"❌ Unauthorized access test error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Authentication implementation test completed!")


if __name__ == "__main__":
    test_auth_flow()
