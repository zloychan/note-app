import pytest
from datetime import datetime
from pydantic import ValidationError
from app.schemas import (
    UserBase, UserCreate, User, NoteBase, 
    NoteCreate, Note, UserWithNotes, Token, TokenData
)

def test_user_base_schema():
    """Test UserBase schema validation."""
    # Valid email
    user = UserBase(email="test@example.com")
    assert user.email == "test@example.com"

    # Invalid email
    with pytest.raises(ValidationError):
        UserBase(email="invalid-email")

def test_user_create_schema():
    """Test UserCreate schema validation."""
    user = UserCreate(
        email="test@example.com",
        password="secretpassword"
    )
    assert user.email == "test@example.com"
    assert user.password == "secretpassword"

def test_user_schema():
    """Test User schema with all fields."""
    current_time = datetime.now()
    user_data = {
        "email": "test@example.com",
        "id": 1,
        "is_active": True,
        "created_at": current_time,
        "updated_at": current_time
    }
    user = User(**user_data)
    assert user.email == "test@example.com"
    assert user.id == 1
    assert user.is_active is True
    assert isinstance(user.created_at, datetime)
    assert isinstance(user.updated_at, datetime)

def test_note_base_schema():
    """Test NoteBase schema validation."""
    note = NoteBase(
        title="Test Note",
        content="This is a test note"
    )
    assert note.title == "Test Note"
    assert note.content == "This is a test note"

def test_note_create_schema():
    """Test NoteCreate schema."""
    note = NoteCreate(
        title="Test Note",
        content="This is a test note"
    )
    assert note.title == "Test Note"
    assert note.content == "This is a test note"

def test_note_schema():
    """Test Note schema with all fields."""
    current_time = datetime.now()
    note_data = {
        "id": 1,
        "title": "Test Note",
        "content": "This is a test note",
        "created_at": current_time,
        "updated_at": current_time,
        "owner_id": 1
    }
    note = Note(**note_data)
    assert note.id == 1
    assert note.title == "Test Note"
    assert note.content == "This is a test note"
    assert isinstance(note.created_at, datetime)
    assert isinstance(note.updated_at, datetime)
    assert note.owner_id == 1

def test_user_with_notes_schema():
    """Test UserWithNotes schema including the notes relationship."""
    current_time = datetime.now()
    user_data = {
        "email": "test@example.com",
        "id": 1,
        "is_active": True,
        "created_at": current_time,
        "updated_at": current_time,
        "notes": [
            {
                "id": 1,
                "title": "Test Note",
                "content": "This is a test note",
                "created_at": current_time,
                "updated_at": current_time,
                "owner_id": 1
            }
        ]
    }
    user = UserWithNotes(**user_data)
    assert user.email == "test@example.com"
    assert len(user.notes) == 1
    assert user.notes[0].title == "Test Note"

def test_token_schema():
    """Test Token schema validation."""
    token = Token(
        access_token="some-jwt-token",
        token_type="bearer"
    )
    assert token.access_token == "some-jwt-token"
    assert token.token_type == "bearer"

def test_token_data_schema():
    """Test TokenData schema validation."""
    # With email
    token_data = TokenData(email="test@example.com")
    assert token_data.email == "test@example.com"

    # Without email (Optional field)
    token_data = TokenData()
    assert token_data.email is None
