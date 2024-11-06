from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash
from typing import List, Optional

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_note(db: Session, note: schemas.NoteCreate, user_id: int) -> models.Note:
    db_note = models.Note(
        title=note.title,
        content=note.content,
        owner_id=user_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.Note]:
    return db.query(models.Note)\
        .filter(models.Note.owner_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def get_note(db: Session, note_id: int, user_id: int) -> Optional[models.Note]:
    return db.query(models.Note)\
        .filter(models.Note.id == note_id)\
        .filter(models.Note.owner_id == user_id)\
        .first()

def update_note(db: Session, note_id: int, note: schemas.NoteCreate, user_id: int) -> Optional[models.Note]:
    db_note = get_note(db, note_id, user_id)
    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db.commit()
        db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: int, user_id: int) -> bool:
    db_note = get_note(db, note_id, user_id)
    if db_note:
        db.delete(db_note)
        db.commit()
        return True
    return False