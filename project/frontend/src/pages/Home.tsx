import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
} from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import { RootState } from '../redux/store';
import { setForums, setLoading, setError } from '../redux/slices/forumSlice';
import { forumAPI } from '../services/api';

const Home = () => {
  const dispatch = useDispatch();
  const { forums, loading, error } = useSelector((state: RootState) => state.forums);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        dispatch(setLoading(true));
        const response = await forumAPI.getAll();
        dispatch(setForums(response.data));
      } catch (err) {
        dispatch(setError('Error fetching forums'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchForums();
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Community Forums
      </Typography>
      <Grid container spacing={3}>
        {forums.map((forum) => (
          <Grid item xs={12} md={6} key={forum.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component={RouterLink} to={`/forum/${forum.id}`} sx={{ textDecoration: 'none' }}>
                  {forum.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Posted by {forum.user.username}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
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
                  {forum.likes}
                </Button>
                <Button startIcon={<Comment />} size="small">
                  {forum.comments.length}
                </Button>
                <Button
                  component={RouterLink}
                  to={`/forum/${forum.id}`}
                  size="small"
                  color="primary"
                >
                  View Discussion
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 