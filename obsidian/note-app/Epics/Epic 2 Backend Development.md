Description: Develop the backend API using FastAPI, implementing user authentication and CRUD operations for notes.

### Substeps:

[[2.1. Install Backend Dependencies]]

- Activate the virtual environment.
- Install FastAPI, Uvicorn, SQLAlchemy, and other required packages.
- Update `requirements.txt` with all dependencies.

[[2.2. Set Up FastAPI Application]]

- Create `main.py` as the entry point of the application.
- Configure the FastAPI instance and include middleware (e.g., CORS).

[[2.3. Database Configuration]]

- Set up `database.py` to manage database connections using SQLAlchemy.
- Configure SQLite as the database engine for development.

[[2.4. Define Models]]

- Create `models.py` with SQLAlchemy models for `User` and `Note`.
- Establish relationships between models.

[[2.5. Create Schemas]]

- Define Pydantic models in `schemas.py` for data validation and serialization.

[[2.6. Implement Authentication]]

- Create `auth.py` for handling authentication logic.
- Implement password hashing and JWT token generation.
- Set up routes in `routers/auth.py` for user registration and login.

[[2.7. Develop CRUD Operations for Notes]]

- Create `crud.py` with functions for creating, reading, updating, and deleting notes.
- Implement routes in `routers/notes.py` for note operations.
- Secure note routes with authentication dependencies.

[[2.8. Test API Endpoints]]

- Run the application using Uvicorn.
- Use the interactive Swagger UI at `/docs` to test endpoints.