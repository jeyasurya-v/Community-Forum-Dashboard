# Community Forums Application

A modern, full-stack web application for creating and managing community forums. Built with React, TypeScript, Node.js, and MySQL.

## Project Structure

```
project/
├── frontend/         # React TypeScript frontend application
├── backend/         # Node.js TypeScript backend API
└── README.md        # This file
```

## Features

- 🔐 User Authentication (JWT)
- 👥 User Profiles
- 📝 Forum Creation and Management
- 💬 Comments System
- 👍 Like/Unlike Forums and Comments
- 🏷️ Forum Tags
- 🔍 Search Functionality
- 📱 Responsive Design

## Technology Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Material-UI for components
- Axios for API calls
- React Router v6
- Vite for build tooling

### Backend
- Node.js with TypeScript
- Express.js framework
- TypeORM for database management
- MySQL database
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Set up the backend:
```bash
cd backend
cp .env.example .env
npm install
```

3. Configure the backend environment variables in `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=forums_db
JWT_SECRET=your_jwt_secret
```

4. Set up the frontend:
```bash
cd ../frontend
cp .env.example .env
npm install
```

5. Configure the frontend environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### Running the Application

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

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Forum Endpoints
- GET `/api/forums` - Get all forums
- GET `/api/forums/:id` - Get forum by ID
- POST `/api/forums` - Create new forum
- PUT `/api/forums/:id` - Update forum
- DELETE `/api/forums/:id` - Delete forum
- POST `/api/forums/:id/like` - Like/unlike forum

### Comment Endpoints
- GET `/api/comments/forum/:forumId` - Get forum comments
- POST `/api/comments/forum/:forumId` - Create comment
- PUT `/api/comments/:id` - Update comment
- DELETE `/api/comments/:id` - Delete comment
- POST `/api/comments/:id/like` - Like/unlike comment

## Performance Optimizations

### Frontend
- Implemented lazy loading for routes
- Used React.memo for performance-critical components
- Optimized Redux state updates
- Implemented request debouncing
- Used proper key props for lists

### Backend
- Implemented query caching
- Optimized database queries
- Added proper indexing
- Implemented rate limiting
- Used connection pooling

## Security Features

- JWT Authentication
- Password Hashing
- CORS Protection
- Rate Limiting
- Input Validation
- XSS Protection
- SQL Injection Prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
