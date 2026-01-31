import requests
import json

# Test the login endpoint as described in the setup instructions
def test_login():
    url = "http://localhost:8000/api/auth/login"
    data = {
        "username": "admin",
        "password": "admin"
    }
    
    print("Testing login endpoint...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Login successful!")
            token = result.get("access_token")
            print(f"Token received: {token[:50]}..." if token else "No token received")
            return token
        else:
            print("❌ Login failed")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_tasks_endpoint(token):
    if not token:
        print("Skipping tasks test - no token available")
        return
    
    url = "http://localhost:8000/api/tasks"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    tasks_data = [
        {
            "project": "TestProject",
            "taskName": "Test Task",
            "hour": 2,
            "date": "2025-11-25"
        }
    ]
    
    print("\nTesting tasks endpoint...")
    print(f"URL: {url}")
    print(f"Data: {tasks_data}")
    
    try:
        response = requests.post(url, json=tasks_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Tasks creation successful!")
        else:
            print("❌ Tasks creation failed")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Test login
    token = test_login()
    
    # Test tasks endpoint
    test_tasks_endpoint(token)