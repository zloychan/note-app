import pytest
from fastapi.testclient import TestClient
from app.models import User, Note
from app.schemas import NoteCreate
from app.auth import create_access_token

@pytest.fixture
def test_user(db_session):
    """Create a test user and return it."""
    user = User(
        email="test@example.com",
        hashed_password="hashedpassword123",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_token(test_user):
    """Create a test token for authentication."""
    return create_access_token({"sub": test_user.email})

@pytest.fixture
def authorized_client(client, test_token):
    """Create an authorized client with the test token."""
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {test_token}"
    }
    return client

@pytest.fixture
def test_notes(db_session, test_user):
    """Create test notes for the test user."""
    notes_data = [
        {"title": f"Test Note {i}", "content": f"Content {i}", "owner_id": test_user.id}
        for i in range(3)
    ]
    notes = [Note(**data) for data in notes_data]
    db_session.add_all(notes)
    db_session.commit()
    return [db_session.refresh(note) or note for note in notes]
def test_create_note(authorized_client):
    """Test creating a new note."""
    note_data = {
        "title": "Test Note",
        "content": "This is a test note content"
    }
    response = authorized_client.post("/notes/", json=note_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == note_data["title"]
    assert data["content"] == note_data["content"]
    assert "id" in data
    assert "created_at" in data

def test_create_note_unauthorized(client):
    """Test creating a note without authentication."""
    note_data = {
        "title": "Test Note",
        "content": "This is a test note content"
    }
    response = client.post("/notes/", json=note_data)
    assert response.status_code == 401

def test_read_notes(authorized_client, test_notes):
    """Test retrieving all notes for the current user."""
    response = authorized_client.get("/notes/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(test_notes)
    assert all(note["title"].startswith("Test Note") for note in data)

def test_read_notes_unauthorized(client):
    """Test retrieving notes without authentication."""
    response = client.get("/notes/")
    assert response.status_code == 401
def test_read_single_note(authorized_client, test_notes):
    """Test retrieving a single note by ID."""
    note_id = test_notes[0].id
    response = authorized_client.get(f"/notes/{note_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == note_id
    assert data["title"] == test_notes[0].title

def test_read_nonexistent_note(authorized_client):
    """Test retrieving a note that doesn't exist."""
    response = authorized_client.get("/notes/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"

def test_read_note_unauthorized(client, test_notes):
    """Test retrieving a single note without authentication."""
    response = client.get(f"/notes/{test_notes[0].id}")
    assert response.status_code == 401

def test_update_note(authorized_client, test_notes):
    """Test updating an existing note."""
    note_id = test_notes[0].id
    updated_data = {
        "title": "Updated Title",
        "content": "Updated content"
    }
    response = authorized_client.put(f"/notes/{note_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == updated_data["title"]
    assert data["content"] == updated_data["content"]
def test_update_nonexistent_note(authorized_client):
    """Test updating a note that doesn't exist."""
    updated_data = {
        "title": "Updated Title",
        "content": "Updated content"
    }
    response = authorized_client.put("/notes/99999", json=updated_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"

def test_delete_note(authorized_client, test_notes):
    """Test deleting a note."""
    note_id = test_notes[0].id
    response = authorized_client.delete(f"/notes/{note_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Note deleted successfully"

    # Verify note is deleted
    response = authorized_client.get(f"/notes/{note_id}")
    assert response.status_code == 404

def test_delete_nonexistent_note(authorized_client):
    """Test deleting a note that doesn't exist."""
    response = authorized_client.delete("/notes/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"

def test_user_isolation(authorized_client, db_session):
    """Test that users can only access their own notes."""
    # Create another user with their own note
    other_user = User(
        email="other@example.com",
        hashed_password="hashedpassword123",
        is_active=True
    )
    db_session.add(other_user)
    db_session.commit()

    other_note = Note(
        title="Other User's Note",
        content="This note belongs to another user",
        owner_id=other_user.id
    )
    db_session.add(other_note)
    db_session.commit()

    # Try to access the other user's note
    response = authorized_client.get(f"/notes/{other_note.id}")
    assert response.status_code == 404

def test_register_user(client):
    """Test registering a new user."""
    user_data = {
        "email": "newuser@example.com",
        "password": "testpassword123"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert "id" in data
    assert "is_active" in data
    assert data["is_active"] == True

    # Verify user can login with created credentials
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    login_response = client.post("/auth/token", data=login_data)
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

def test_note_isolation_operations(client, db_session):
    """Test that users can only delete, update, and recreate their own notes."""
    # Create two users
    user1_data = {
        "email": "user1@example.com",
        "password": "password123"
    }
    user2_data = {
        "email": "user2@example.com",
        "password": "password123"
    }

    # Register both users
    client.post("/auth/register", json=user1_data)
    client.post("/auth/register", json=user2_data)

    # Login both users to get their tokens
    login1_data = {
        "username": user1_data["email"],
        "password": user1_data["password"]
    }
    login2_data = {
        "username": user2_data["email"],
        "password": user2_data["password"]
    }

    token1 = client.post("/auth/token", data=login1_data).json()["access_token"]
    token2 = client.post("/auth/token", data=login2_data).json()["access_token"]

    # Create clients with authentication
    client1 = TestClient(client.app)
    client2 = TestClient(client.app)
    client1.headers = {"Authorization": f"Bearer {token1}"}
    client2.headers = {"Authorization": f"Bearer {token2}"}

    # User 1 creates a note
    note_data = {
        "title": "User 1's Note",
        "content": "This is user 1's content"
    }
    create_response = client1.post("/notes/", json=note_data)
    assert create_response.status_code == 200
    note_id = create_response.json()["id"]

    # User 2 tries to delete User 1's note
    delete_response = client2.delete(f"/notes/{note_id}")
    assert delete_response.status_code == 404  # Note should not be found for User 2

    # User 2 tries to update User 1's note
    update_data = {
        "title": "Attempted Update",
        "content": "This should not work"
    }
    update_response = client2.put(f"/notes/{note_id}", json=update_data)
    assert update_response.status_code == 404  # Note should not be found for User 2

    # Verify User 1's note remains unchanged
    get_response = client1.get(f"/notes/{note_id}")
    assert get_response.status_code == 200
    note = get_response.json()
    assert note["title"] == note_data["title"]
    assert note["content"] == note_data["content"]

    # User 1 deletes their note
    delete_response = client1.delete(f"/notes/{note_id}")
    assert delete_response.status_code == 200

    # User 2 creates a new note
    note2_data = {
        "title": "User 2's Note",
        "content": "This is user 2's content"
    }
    create_response2 = client2.post("/notes/", json=note2_data)
    assert create_response2.status_code == 200
    new_note = create_response2.json()
    
    # Verify the new note belongs to User 2
    assert new_note["title"] == note2_data["title"]
    assert new_note["content"] == note2_data["content"]

    # Verify User 1 cannot access User 2's new note
    get_response = client1.get(f"/notes/{new_note['id']}")
    assert get_response.status_code == 404