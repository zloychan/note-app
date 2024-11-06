from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with Notes
    notes = relationship("Note", back_populates="owner", cascade="all, delete-orphan")

class Note(Base):
      __tablename__ = "notes"

      id = Column(Integer, primary_key=True, index=True)
      title = Column(String(255), index=True)
      content = Column(Text)
      created_at = Column(DateTime(timezone=True), server_default=func.now())
      updated_at = Column(DateTime(timezone=True), onupdate=func.now())
      owner_id = Column(Integer, ForeignKey("users.id"))

      # Relationship with User
      owner = relationship("User", back_populates="notes")
