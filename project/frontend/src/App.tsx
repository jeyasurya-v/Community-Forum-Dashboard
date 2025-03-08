import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RootState } from './redux/store';
import { restoreSession, logout, setInitialized } from './redux/slices/authSlice';
import { authAPI } from './services/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForumDetail from './pages/ForumDetail';
import CreateForum from './pages/CreateForum';
import EditForum from './pages/EditForum';
import Profile from './pages/Profile';

/**
 * Application theme configuration
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
  const localStorageToken = localStorage.getItem("token");
  console.log("localStorageToken", localStorageToken);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  
  if (!localStorageToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

/**
 * Main App component
 * Handles authentication initialization and routing
 */
const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status on app load
   * Restores user session if valid token exists
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
    
        if (!token) {
          dispatch(setInitialized());
          setIsLoading(false);
          return;
        }
    
        // Verify token with backend
        const response = await authAPI.getCurrentUser();
    
        if (response.data) {
          dispatch(restoreSession({ user: response.data }));
        } else {
          throw new Error("Invalid session");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        dispatch(logout());
      } finally {
        dispatch(setInitialized());
        setIsLoading(false);
      }
    };    

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/create-forum" element={<PrivateRoute><CreateForum /></PrivateRoute>} />
          <Route path="/forum/:id/edit" element={<PrivateRoute><EditForum /></PrivateRoute>} />
          <Route path="/forum/:id" element={<PrivateRoute><ForumDetail /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;