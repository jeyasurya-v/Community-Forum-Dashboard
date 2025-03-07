# Community Forums Application

A full-stack web application where users can create forums, interact through comments, and engage in discussions.

## Features

- User authentication with JWT
- Create, read, update, and delete forums
- Comment on forums
- Like/upvote forums and comments
- User profiles
- Responsive design with Material UI and Tailwind CSS

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material UI and Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js with Express
- TypeORM for database operations
- MySQL database
- JWT for authentication

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Frontend
cp frontend/.env.example frontend/.env
```

4. Create the database:
```sql
CREATE DATABASE community_forums;
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Forums
- GET /api/forums - Get all forums
- GET /api/forums/:id - Get a specific forum
- POST /api/forums - Create a new forum
- PUT /api/forums/:id - Update a forum
- DELETE /api/forums/:id - Delete a forum
- POST /api/forums/:id/like - Like a forum

### Comments
- GET /api/comments/forum/:forumId - Get comments for a forum
- POST /api/comments/forum/:forumId - Create a comment
- PUT /api/comments/:id - Update a comment
- DELETE /api/comments/:id - Delete a comment
- POST /api/comments/:id/like - Like a comment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 