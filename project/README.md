# Forum Application

A modern forum application built with React, TypeScript, and Node.js.

## Project Structure

```
project/
├── frontend/           # React TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── redux/     # Redux state management
│   │   └── services/  # API services
│   └── ...
└── backend/           # Node.js TypeScript backend
    ├── src/
    │   ├── config/    # Configuration
    │   ├── entities/  # Database entities
    │   ├── routes/    # API routes
    │   └── middleware/# Custom middleware
    └── ...
```

## Key Features

- Secure JWT-based authentication
- Forum creation and management
- Comment system
- User profiles
- Like/Unlike functionality
- Protected routes
- Persistent authentication

## Authentication Flow

1. User logs in/registers -> receives JWT token
2. Token stored in localStorage
3. Token automatically attached to API requests
4. Protected routes check authentication status
5. Auto-logout on token expiration

## Getting Started

### Prerequisites
- Node.js 14+
- npm or yarn
- PostgreSQL database

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy .env.example to .env and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
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
3. Copy .env.example to .env and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features

- JWT token authentication
- Protected API routes
- Secure password hashing
- CORS configuration
- Request validation
- Error handling middleware

## State Management

- Redux for global state
- Local storage for auth persistence
- Centralized API service
- Type-safe actions and reducers
