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