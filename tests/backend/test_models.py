import pytest
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from app.models import User, Note

@pytest.fixture(autouse=True)
def cleanup_db(db_session):
    db_session.rollback()
    # Clear any existing data
    db_session.query(Note).delete()
    db_session.query(User).delete()
    db_session.commit()
    
    yield
    
    # Cleanup after test
    db_session.rollback()
    db_session.query(Note).delete()
    db_session.query(User).delete()
    db_session.commit()

def test_create_user(db_session):
    """Test user creation with all fields."""
    user = User(
        email="user1@example.com",
        hashed_password="hashedpassword123",
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.email == "user1@example.com"
    assert user.hashed_password == "hashedpassword123"
    assert user.is_active is True
    assert isinstance(user.created_at, datetime)
    assert user.notes == []

def test_create_note(db_session):
    """Test note creation with all fields."""
    # Create a user first
    user = User(email="user2@example.com", hashed_password="hashedpassword123")
    db_session.add(user)
    db_session.commit()

    # Create a note
    note = Note(
        title="Test Note",
        content="This is a test note",
        owner_id=user.id
    )
    db_session.add(note)
    db_session.commit()
    db_session.refresh(note)

    assert note.id is not None
    assert note.title == "Test Note"
    assert note.content == "This is a test note"
    assert note.owner_id == user.id
    assert isinstance(note.created_at, datetime)
    assert note.owner == user

def test_user_note_relationship(db_session):
    """Test the relationship between User and Note models."""
    # Create a user
    user = User(email="user3@example.com", hashed_password="hashedpassword123")
    db_session.add(user)
    db_session.commit()

    # Create multiple notes for the user
    notes = [
        Note(title=f"Note {i}", content=f"Content {i}", owner_id=user.id)
        for i in range(3)
    ]
    db_session.add_all(notes)
    db_session.commit()

    # Verify relationships
    assert len(user.notes) == 3
    assert all(note.owner == user for note in user.notes)

def test_unique_email_constraint(db_session):
    """Test that users must have unique emails."""
    # Create first user
    user1 = User(email="user4@example.com", hashed_password="hashedpassword123")
    db_session.add(user1)
    db_session.commit()

    # Try to create second user with same email
    user2 = User(email="user4@example.com", hashed_password="differentpassword")
    db_session.add(user2)
    
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_cascade_delete(db_session):
    """Test that deleting a user also deletes their notes."""
    # Create user
    user = User(email="user5@example.com", hashed_password="hashedpassword123")
    db_session.add(user)
    db_session.commit()
    
    # Create notes
    notes = [
        Note(title=f"Note {i}", content=f"Content {i}", owner_id=user.id)
        for i in range(3)
    ]
    db_session.add_all(notes)
    db_session.commit()

    # Verify notes exist
    note_count = db_session.query(Note).filter_by(owner_id=user.id).count()
    assert note_count == 3

    # Store user id for later verification
    user_id = user.id

    # Delete user
    db_session.delete(user)
    db_session.commit()

    # Clear session
    db_session.close()
    
    # Create new session for verification
    remaining_notes = db_session.query(Note).filter_by(owner_id=user_id).all()
    assert len(remaining_notes) == 0