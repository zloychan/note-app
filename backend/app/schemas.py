from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class NoteBase(BaseModel):
      title: str
      content: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner_id: int

    class Config:
        from_attributes = True

class UserWithNotes(User):
      notes: List[Note] = []

      class Config:
          from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None