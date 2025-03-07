import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RootState } from './redux/store';
import { restoreSession, logout } from './redux/slices/authSlice';
import { authAPI } from './services/api';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForumDetail from './pages/ForumDetail';
import CreateForum from './pages/CreateForum';
import EditForum from './pages/EditForum';
import Profile from './pages/Profile';

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

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log("User Authenticated:", isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreUserSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          dispatch(restoreSession({ user: response.data, token }));
  
          // Restore last visited page (if exists)
          const lastVisitedPage = localStorage.getItem("lastVisitedPage");
          if (lastVisitedPage) {
            window.history.replaceState(null, "", lastVisitedPage);
            localStorage.removeItem("lastVisitedPage"); // Clear after restoring
          }
        } catch (error) {
          console.error("Error restoring session:", error);
          localStorage.removeItem("token"); // Clear invalid token
          dispatch(logout());
        }
      }
      setIsLoading(false);
    };
  
    restoreUserSession();
  }, [dispatch]);
  

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-forum"
            element={
              <PrivateRoute>
                <CreateForum />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum/:id/edit"
            element={
              <PrivateRoute>
                <EditForum />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum/:id"
            element={
              <PrivateRoute>
                <ForumDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
