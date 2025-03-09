# Forum Application

A modern, full-stack forum application built with React, TypeScript, and Node.js.

## Project Architecture

```
.
├── backend/                 # Node.js + TypeScript backend
│   ├── src/
│   │   ├── config/         # Application configuration
│   │   ├── entities/       # TypeORM entities
│   │   ├── middleware/     # Custom middleware (auth, validation)
│   │   └── routes/         # API route handlers
│   ├── .env.example        # Environment variables template
│   └── README.md           # Backend documentation
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   │   └── slices/    # Redux toolkit slices
│   │   └── services/      # API services
│   ├── .env.example       # Environment variables template
│   └── README.md          # Frontend documentation
│
└── README.md              # Project documentation (this file)
```

## Technical Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI** for UI components
- **Axios** for API communication
- **React Router v6** for routing

### Backend
- **Node.js** with TypeScript
- **Express.js** framework
- **TypeORM** for database management
- **MySQL** database
- **JWT** for authentication

## Core Features

1. **Authentication System**
   - JWT-based authentication
   - Persistent sessions
   - Protected routes
   - Secure token management

2. **Forum Management**
   - Create/Edit/Delete forums
   - Comment system
   - Like/Unlike functionality
   - User profiles

3. **Security Features**
   - Token-based authentication
   - Password hashing
   - Protected API endpoints
   - Input validation

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn
- MySQL database

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure Details

### Frontend Organization
- **components/**: Reusable UI components
- **pages/**: Main route components
- **redux/**: State management
  - **slices/**: Feature-based state slices
- **services/**: API communication layer

### Backend Organization
- **config/**: Application configuration
- **entities/**: Database models
- **middleware/**: Custom middleware
- **routes/**: API endpoints

## Authentication Flow

1. **Login/Register**
   - User submits credentials
   - Backend validates and returns JWT
   - Frontend stores token in localStorage

2. **Session Management**
   - Token attached to all API requests
   - Auto-logout on token expiration
   - Session persistence across refreshes

3. **Protected Routes**
   - Route protection via PrivateRoute component
   - Automatic redirection to login
   - Token validation on each request

## Development Practices

- TypeScript for type safety
- Component-based architecture
- Redux for state management
- Material-UI for consistent design
- JWT for secure authentication
- Proper error handling
- Loading state management

## API Documentation

### Auth Endpoints
- POST `/auth/register` - Register new user
- POST `/auth/login` - User login
- GET `/auth/me` - Get current user

### Forum Endpoints
- GET `/forums` - List all forums
- POST `/forums` - Create forum
- PUT `/forums/:id` - Update forum
- DELETE `/forums/:id` - Delete forum

### Comment Endpoints
- GET `/comments/forum/:forumId` - Get forum comments
- POST `/comments/forum/:forumId` - Add comment
- PUT `/comments/:id` - Update comment
- DELETE `/comments/:id` - Delete comment
