# Community Forums Frontend

The frontend application for the Community Forums project, built with React, TypeScript, and Material-UI.

## Directory Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── redux/         # Redux state management
│   │   ├── slices/    # Redux Toolkit slices
│   │   └── store.ts   # Redux store configuration
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── README.md          # This file
```

## Key Components

### Pages
- `Home.tsx` - Main forum listing page
- `ForumDetail.tsx` - Individual forum view with comments
- `CreateForum.tsx` - Forum creation form
- `EditForum.tsx` - Forum editing form
- `Login.tsx` - User login page
- `Register.tsx` - User registration page
- `Profile.tsx` - User profile page

### Components
- `Navbar.tsx` - Navigation bar with authentication state
- `ForumCard.tsx` - Forum preview card
- `CommentSection.tsx` - Forum comments section
- `LikeButton.tsx` - Like functionality for forums/comments
- `PrivateRoute.tsx` - Route protection for authenticated users

## State Management

### Redux Slices
- `authSlice.ts` - Authentication state management
- `forumSlice.ts` - Forums state management
- `uiSlice.ts` - UI state management (loading, errors, etc.)

### API Services
- `api.ts` - Axios instance and interceptors
- `authAPI.ts` - Authentication endpoints
- `forumAPI.ts` - Forum-related endpoints
- `commentAPI.ts` - Comment-related endpoints

## Performance Optimizations

### Code Splitting
```typescript
// App.tsx
const Home = React.lazy(() => import('./pages/Home'));
const ForumDetail = React.lazy(() => import('./pages/ForumDetail'));
```

### Memoization
```typescript
// Components using React.memo for performance
export const ForumCard = React.memo(({ forum }: ForumCardProps) => {
  // Component logic
});
```

### Request Optimization
```typescript
// Debounced search
const debouncedSearch = debounce((query: string) => {
  dispatch(searchForums(query));
}, 300);
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start development server:
```bash
npm run dev
```

## Building for Production

1. Create production build:
```bash
npm run build
```

2. Preview production build:
```bash
npm run preview
```

## Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Code Quality

### ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "strict": true
  }
}
```

## Best Practices

### Component Structure
```typescript
// Example component structure
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface Props {
  // Props interface
}

export const Component: React.FC<Props> = ({ prop }) => {
  // Component logic
};
```

### Error Handling
```typescript
try {
  await api.someRequest();
} catch (error) {
  if (error instanceof AxiosError) {
    // Handle API errors
  } else {
    // Handle other errors
  }
}
```

### State Management
```typescript
// Example Redux slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  // State interface
}

const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    // Reducers
  }
});
```

## Contributing

1. Follow the code style guide
2. Write meaningful commit messages
3. Add proper documentation
4. Write unit tests for new features
5. Update README when necessary

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier 