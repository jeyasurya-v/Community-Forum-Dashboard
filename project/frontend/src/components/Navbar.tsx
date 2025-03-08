import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isToken = localStorage.getItem('token');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Community Forums Dashboard
          </Typography>
          <Box>
            {isToken ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create-forum"
                  sx={{ mr: 2 }}
                >
                  Create Forum
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  sx={{ mr: 2 }}
                >
                  Profile
                </Button>
                <Button color="inherit" onClick={handleLogoutClick}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ mr: 2 }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog 
        open={logoutDialogOpen} 
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel}>No</Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar; 