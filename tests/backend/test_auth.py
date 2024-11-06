import pytest
from datetime import timedelta
from jose import jwt
from fastapi import HTTPException
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    SECRET_KEY,
    ALGORITHM
)
from app.schemas import UserCreate
from app.models import User

def test_password_hashing():
    """Test password hashing and verification."""
    password = "testpassword123"
    hashed = get_password_hash(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_create_access_token():
    """Test JWT token creation."""
    data = {"sub": "test@example.com"}
    expires_delta = timedelta(minutes=15)
    
    token = create_access_token(data, expires_delta)
    
    # Decode and verify token
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload.get("sub") == "test@example.com"
    assert "exp" in payload

@pytest.mark.asyncio
async def test_get_current_user_valid_token(db_session):
    """Test getting current user with valid token."""
    # Create test user
    password_hash = get_password_hash("testpass123")
    user = User(email="test@example.com", hashed_password=password_hash)
    db_session.add(user)
    db_session.commit()
    
    # Create token
    access_token = create_access_token({"sub": user.email})
    
    # Get current user
    current_user = await get_current_user(access_token, db_session)
    assert current_user.email == user.email

@pytest.mark.asyncio
async def test_get_current_user_invalid_token(db_session):
    """Test getting current user with invalid token."""
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user("invalid_token", db_session)
    assert exc_info.value.status_code == 401
