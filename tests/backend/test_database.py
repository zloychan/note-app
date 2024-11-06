from sqlalchemy import text

def test_database_connection(db_session):
    """Test that a database connection can be established."""
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1

def test_get_db_dependency(db_session):
    """Test the get_db dependency provides a session."""
    result = db_session.execute(text("SELECT 1"))
    assert result.scalar() == 1

def test_environment_variable():
    """Test that the environment variable for DATABASE_URL is set correctly."""
    from tests.conftest import SQLALCHEMY_DATABASE_URL
    assert SQLALCHEMY_DATABASE_URL == "sqlite:///./test.db"

def test_endpoint_database_connection(client):
    """Test that the /test-db endpoint can access the database."""
    response = client.get("/test-db")
    assert response.status_code == 200
    assert response.json() == {"message": "Database connection successful"}