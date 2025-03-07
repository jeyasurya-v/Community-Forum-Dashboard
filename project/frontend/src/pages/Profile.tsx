import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import { RootState } from '../redux/store';
import { setForums, setLoading, setError } from '../redux/slices/forumSlice';
import { forumAPI } from '../services/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { forums, loading, error } = useSelector((state: RootState) => state.forums);

  useEffect(() => {
    const fetchUserForums = async () => {
      try {
        dispatch(setLoading(true));
        const response = await forumAPI.getAll();
        const userForums = response.data.filter(
          (forum) => forum.user.id === user?.id
        );
        dispatch(setForums(userForums));
      } catch (err) {
        dispatch(setError('Error fetching your forums'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (user) {
      fetchUserForums();
    }
  }, [dispatch, user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Username</Typography>
          <Typography>{user?.username}</Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Email</Typography>
          <Typography>{user?.email}</Typography>
        </Box>

        <Typography variant="h5" gutterBottom>
          Your Forums
        </Typography>
        <Grid container spacing={3}>
          {forums.map((forum) => (
            <Grid item xs={12} key={forum.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{forum.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Created on {new Date(forum.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {forum.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {forum.tags?.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button startIcon={<ThumbUp />} size="small">
                    {forum.likes} Likes
                  </Button>
                  <Button startIcon={<Comment />} size="small">
                    {forum.comments.length} Comments
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 