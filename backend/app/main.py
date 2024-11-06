from fastapi import FastAPI, Depends, HTTPException
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
from .database import engine, Base, get_db
from . import models
from . import schemas
from .routers import auth, notes


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Notes API",
    description="API for managing personal notes",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:8080",  # Vue.js frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add after existing middleware configuration
app.include_router(auth.router)
app.include_router(notes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Notes API"}

@app.get("/test-db")
async def test_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"message": "Database connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))