# Notes App with FastAPI and Vue.js

A simple notes application where users can register, log in, and manage their personal notes. This project uses **FastAPI** for the backend API and **Vue.js** for the frontend interface. It's designed to help you learn how to create fast MVP projects using these technologies.

![Notes App Preview](https://via.placeholder.com/800x400.png?text=Notes+App+Preview)

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Backend Details](#backend-details)
  - [API Endpoints](#api-endpoints)
  - [Directory Breakdown](#directory-breakdown)
- [Frontend Details](#frontend-details)
  - [Key Components](#key-components)
  - [Views](#views)
  - [Components](#components)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Secure registration and login using JWT tokens.
- **Personal Notes**: Create, read, update, and delete notes.
- **Responsive UI**: Clean and responsive design with Bootstrap 5.
- **Interactive API Documentation**: Accessible via Swagger UI at `/docs`.
- **Separation of Concerns**: Clean separation between frontend and backend.

---

## Technologies Used

### Backend

- [Python 3.7+](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [SQLite](https://www.sqlite.org/index.html)
- [JWT Authentication](https://jwt.io/)

### Frontend

- [Vue.js 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Bootstrap 5](https://getbootstrap.com/)

---

## Project Structure

```
notes-app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── crud.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       └── notes.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.vue
│   │   │   └── NoteCard.vue
│   │   ├── views/
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── Notes.vue
│   │   ├── App.vue
│   │   ├── main.js
│   │   └── router.js
│   ├── package.json
│   └── vue.config.js
├── README.md
└── .gitignore
```

---

## Prerequisites

- **Python 3.7+**: [Download and install](https://www.python.org/downloads/)
- **Node.js and npm**: [Download and install](https://nodejs.org/en/download/)
- **Git**: [Download and install](https://git-scm.com/downloads)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/notes-app.git
cd notes-app
```

### 2. Backend Setup

#### a. Navigate to the Backend Directory

```bash
cd backend
```

#### b. Create a Virtual Environment

```bash
python -m venv venv
```

#### c. Activate the Virtual Environment

- **Windows**:

  ```bash
  venv\Scripts\activate
  ```

- **Unix/Linux/Mac**:

  ```bash
  source venv/bin/activate
  ```

#### d. Upgrade Pip (Optional but Recommended)

```bash
pip install --upgrade pip
```

#### e. Install Dependencies

```bash
pip install -r requirements.txt
```

#### f. Run the Server

```bash
uvicorn app.main:app --reload
```

- The server will start at `http://127.0.0.1:8000`.
- Access the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup

Open a new terminal window.

#### a. Navigate to the Frontend Directory

```bash
cd frontend
```

#### b. Install Dependencies

```bash
npm install
```

#### c. Run the Development Server

```bash
npm run serve
```

- The frontend will be available at `http://localhost:8080`.

---

## Usage

1. **Access the Application**: Open your browser and navigate to `http://localhost:8080`.
2. **Register**: Click on the "Register" link and create a new account.
3. **Login**: Use your credentials to log in.
4. **Manage Notes**:
   - **Create**: Add new notes using the provided form.
   - **Read**: View all your notes in the dashboard.
   - **Update**: Edit existing notes.
   - **Delete**: Remove notes you no longer need.

---

## Backend Details

### API Endpoints

#### **Authentication**

- **POST** `/auth/register/` - Register a new user.
  - **Request Body**:

    ```json
    {
      "username": "string",
      "email": "user@example.com",
      "password": "string"
    }
    ```

- **POST** `/auth/token/` - Obtain a JWT token.
  - **Request Body**:

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

#### **Notes**

- **GET** `/notes/` - Get all notes for the authenticated user.
- **POST** `/notes/` - Create a new note.
  - **Request Body**:

    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```

- **GET** `/notes/{note_id}/` - Get a specific note.
- **PUT** `/notes/{note_id}/` - Update a note.
  - **Request Body**:

    ```json
    {
      "title": "string",
      "content": "string"
    }
    ```

- **DELETE** `/notes/{note_id}/` - Delete a note.

### Directory Breakdown

#### `main.py`

- **Description**: Entry point of the FastAPI application.
- **Key Components**:
  - Initializes FastAPI app.
  - Includes middleware for CORS.
  - Registers routers from `routers` package.

#### `models.py`

- **Description**: Defines SQLAlchemy models.
- **Models**:
  - `User`: Represents a user with fields `id`, `username`, `email`, and `hashed_password`.
  - `Note`: Represents a note with fields `id`, `title`, `content`, `owner_id`.

#### `schemas.py`

- **Description**: Defines Pydantic models for data validation.
- **Schemas**:
  - `UserCreate`, `UserRead`, `UserInDB`.
  - `NoteCreate`, `NoteRead`.

#### `database.py`

- **Description**: Manages the database connection.
- **Key Components**:
  - `engine`: SQLAlchemy engine connected to SQLite.
  - `SessionLocal`: Database session class.
  - `Base`: Declarative base class for models.

#### `crud.py`

- **Description**: Contains CRUD utility functions.
- **Functions**:
  - `get_user_by_username()`
  - `create_user()`
  - `get_notes()`
  - `create_note()`
  - `get_note()`
  - `update_note()`
  - `delete_note()`

#### `auth.py`

- **Description**: Handles authentication utilities.
- **Key Components**:
  - Password hashing using `bcrypt`.
  - JWT token creation and validation.

#### `dependencies.py`

- **Description**: Defines dependencies for routes.
- **Key Components**:
  - `get_db()`: Provides a database session.
  - `get_current_user()`: Retrieves the current authenticated user.

#### `routers/`

- **`auth.py`**:
  - Routes for `/auth/register/` and `/auth/token/`.
- **`notes.py`**:
  - Routes for note operations under `/notes/`.

---

## Frontend Details

### Key Components

#### `App.vue`

- **Description**: Root component of the Vue application.
- **Key Components**:
  - Includes `<NavBar />` component.
  - Uses `<router-view />` to render matched components.

#### `main.js`

- **Description**: Entry point for the Vue application.
- **Key Components**:
  - Imports Vue, App component, router, and Bootstrap CSS.
  - Creates and mounts the Vue app.

#### `router.js`

- **Description**: Configures routing for the application.
- **Key Components**:
  - Defines routes for `/`, `/login`, `/register`, `/notes`.
  - Implements navigation guards to protect routes.

### Views

#### `Home.vue`

- **Description**: Landing page of the application.
- **Key Components**:
  - Welcome message.
  - Links to Login and Register if not authenticated.

#### `Register.vue` & `Login.vue`

- **Description**: Forms for user registration and login.
- **Key Components**:
  - Input fields for username, email (registration), and password.
  - Form validation.
  - Submission handlers that call the backend API.

#### `Notes.vue`

- **Description**: Main interface for managing notes.
- **Key Components**:
  - Displays a list of `NoteCard` components.
  - Form to create a new note.
  - Methods to fetch, create, update, and delete notes.

### Components

#### `NavBar.vue`

- **Description**: Navigation bar displayed on all pages.
- **Key Components**:
  - Links to Home, Notes, Login, Register.
  - Shows Logout option when authenticated.
  - Reactive to authentication state.

#### `NoteCard.vue`

- **Description**: Represents a single note.
- **Props**:
  - `note`: The note object containing `id`, `title`, `content`.
- **Key Components**:
  - Displays note title and content.
  - Edit and Delete buttons.
  - Emits events to parent component (`Notes.vue`).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Additional Notes

### Authentication Handling

- **Token Storage**: JWT tokens are stored in `localStorage` for persistence.
- **Axios Configuration**: A default header is set for Axios to include the `Authorization` token in every request.

  ```javascript
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  ```

### State Management

- **Reactive Properties**: Vue's reactive properties are used for basic state management.
- **User State**: Authentication state is managed using local storage and reactive variables.

### Error Handling

- **Backend**: Uses FastAPI's exception handlers to return appropriate HTTP status codes.
- **Frontend**: Displays error messages in forms and uses `try...catch` blocks to handle API errors.

---

## Contact

For any questions or suggestions, feel free to reach out to [your.email@example.com](mailto:your.email@example.com).

---

# Happy Coding!

Feel free to explore and modify the application to suit your learning needs. This project serves as a foundational template to build more complex applications using FastAPI and Vue.js.

---

## Screenshots

### Registration Page

![Registration Page](https://via.placeholder.com/800x400.png?text=Registration+Page)

### Notes Dashboard

![Notes Dashboard](https://via.placeholder.com/800x400.png?text=Notes+Dashboard)

---

## Troubleshooting

- **Module Not Found Errors**: Ensure all dependencies are installed correctly by running `pip install -r requirements.txt` and `npm install`.
- **Database Errors**: Delete `sqlite.db` and let the application recreate it, or check your database connection settings.
- **CORS Issues**: Make sure the backend allows requests from the frontend's origin. The provided code includes CORS middleware to handle this.

---

## Frequently Asked Questions

### Why use FastAPI?

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It's designed to be easy to use and learn, while providing high performance.

### Why use Vue.js for the frontend?

Vue.js is a progressive JavaScript framework for building user interfaces. It is approachable, versatile, and performant, making it a good choice for single-page applications.

### Can I use a different database?

Yes! While SQLite is used for simplicity, you can configure SQLAlchemy to use other databases like PostgreSQL or MySQL.

---

## Learning Resources

- **FastAPI Documentation**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Vue.js Documentation**: [https://vuejs.org/](https://vuejs.org/)
- **SQLAlchemy Documentation**: [https://docs.sqlalchemy.org/](https://docs.sqlalchemy.org/)
- **Axios Documentation**: [https://axios-http.com/docs/intro](https://axios-http.com/docs/intro)

---

**Note**: Replace `yourusername` and `your.email@example.com` with your actual GitHub username and email address in the README.

# Acknowledgments

- Thanks to the creators of FastAPI and Vue.js for their excellent frameworks.
- Inspired by various open-source projects and tutorials.

---

# Backend Code Snippets

## `main.py`

```python
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.routers import auth, notes
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:8080",  # frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(notes.router)
```

## `models.py`

```python
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    notes = relationship("Note", back_populates="owner")

class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'))

    owner = relationship("User", back_populates="notes")
```

---

# Frontend Code Snippets

## `main.js`

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';

createApp(App).use(router).mount('#app');
```

## `router.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Notes from './views/Notes.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/notes', component: Notes, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

---

Feel free to explore the codebase, make changes, and learn how everything works together to create a full-stack application. If you have any questions or need further assistance, don't hesitate to reach out.

Happy coding!