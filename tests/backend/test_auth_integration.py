import pytest
from fastapi.testclient import TestClient

def test_auth_flow(client):
    """Test complete authentication flow."""
    # 1. Register new user
    register_response = client.post(
        "/auth/register",
        json={
            "email": "testflow@example.com",
            "password": "testpass123"
        }
    )
    assert register_response.status_code == 200
    
    # 2. Login with credentials
    login_response = client.post(
        "/auth/token",
        data={
            "username": "testflow@example.com",
            "password": "testpass123"
        }
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    # 3. Access protected endpoint (assuming we have one)
    protected_response = client.get(
        "/test-db",  # Replace with actual protected endpoint
        headers={"Authorization": f"Bearer {token}"}
    )
    assert protected_response.status_code == 200
