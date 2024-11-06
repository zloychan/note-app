from fastapi.testclient import TestClient
from app.main import app

def test_root_endpoint(client):
    """Test the root endpoint returns the welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Notes API"}

def test_test_db_endpoint_success(client):
    """Test the database test endpoint returns success."""
    response = client.get("/test-db")
    assert response.status_code == 200
    assert response.json() == {"message": "Database connection successful"}

def test_cors_headers(client):
    """Test that CORS headers are properly set."""
    response = client.options("/", headers={
        "Origin": "http://localhost:8080",
        "Access-Control-Request-Method": "GET"
    })
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:8080"
    assert response.headers["access-control-allow-credentials"] == "true"

def test_invalid_endpoint(client):
    """Test that invalid endpoints return 404."""
    response = client.get("/nonexistent")
    assert response.status_code == 404