import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions 
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

/**
 * Navbar Component
 * 
 * Handles the main navigation and authentication state display
 * - Shows different options based on authentication state
 * - Manages user logout with confirmation
 * - Provides navigation to key app sections
 */
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isToken = localStorage.getItem('token');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  // Execute logout after confirmation
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* App Title/Logo - Clickable to go home */}
          <Typography 
            variant="h6" 
            style={{ flexGrow: 1, cursor: 'pointer' }} 
            onClick={() => navigate('/')}
          >
            FORUMS
          </Typography>

          {/* Dynamic Navigation Options */}
          {isToken ? (
            <>
            <Button color="inherit" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate('/create-forum')}>
                Create Forum
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogoutClick}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar; 