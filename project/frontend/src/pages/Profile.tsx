import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { RootState } from '../redux/store';

/**
 * Profile Component
 * 
 * Displays authenticated user's profile information
 * Features:
 * - Shows user avatar (first letter of username)
 * - Displays user details (username and email)
 * - Responsive layout with Material-UI components
 * - Loading state handling
 */
const Profile = () => {
  // Get user data from Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  // Show loading state if user data isn't available
  if (!user) {
    return (
      <Container maxWidth="md">
        <Box mt={4} display="flex" justifyContent="center">
          <Typography>Loading profile...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Profile Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user.username[0].toUpperCase()}
            </Avatar>
            <Box ml={3}>
              <Typography variant="h4" gutterBottom>
                Profile
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Welcome back, {user.username}!
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* User Details Card */}
          <Card variant="outlined">
            <CardContent>
              <Box mb={2}>
                <Typography variant="subtitle2" color="textSecondary">
                  USERNAME
                </Typography>
                <Typography variant="h6">
                  {user.username}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  EMAIL ADDRESS
                </Typography>
                <Typography variant="h6">
                  {user.email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 