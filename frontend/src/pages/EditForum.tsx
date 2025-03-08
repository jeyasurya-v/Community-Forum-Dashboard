import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { forumAPI } from '../services/api';
import { RootState } from '../redux/store';
import { updateForum, setCurrentForum } from '../redux/slices/forumSlice';

const EditForum = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentForum } = useSelector((state: RootState) => state.forums);
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await forumAPI.getById(parseInt(id!));
        const forum = response.data;
        if (forum.user.id !== user?.id) {
          navigate('/');
          return;
        }
        dispatch(setCurrentForum(forum));
        setFormData({
          title: forum.title,
          description: forum.description,
          tags: forum.tags?.join(', ') || '',
        });
      } catch (err) {
        setError('Error fetching forum details');
        console.error('Error fetching forum:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchForum();
    }
  }, [id, dispatch, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const response = await forumAPI.update(parseInt(id!), {
        title: formData.title,
        description: formData.description,
        tags,
      });
      dispatch(updateForum(response.data));
      setSuccess('Forum updated successfully!');
      setTimeout(() => navigate(`/forum/${id}`), 1000);
    } catch (err) {
      setError('Error updating forum');
      console.error('Error updating forum:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Edit Forum
        </Typography>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            margin="normal"
            helperText="Enter tags separated by commas"
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Update Forum
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              fullWidth
              onClick={() => navigate(`/forum/${id}`)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditForum; 