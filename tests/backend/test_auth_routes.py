import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_register_user(client):
    """Test user registration endpoint."""
    response = client.post(
        "/auth/register",
        json={"email": "newuser@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "is_active" in data

def test_register_duplicate_user(client):
    """Test registering user with existing email."""
    # Register first user
    client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "testpass123"}
    )
    
    # Try to register same email
    response = client.post(
        "/auth/register",
        json={"email": "duplicate@example.com", "password": "testpass123"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_success(client):
    """Test successful login."""
    # Register user first
    client.post(
        "/auth/register",
        json={"email": "login@example.com", "password": "testpass123"}
    )
    
    # Try to login
    response = client.post(
        "/auth/token",
        data={"username": "login@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    response = client.post(
        "/auth/token",
        data={"username": "wrong@example.com", "password": "wrongpass"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]
