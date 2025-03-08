import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { forumAPI } from '../services/api';
import { addForum } from '../redux/slices/forumSlice';

const CreateForum = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await forumAPI.create({
        title: formData.title,
        description: formData.description,
        tags,
      });

      dispatch(addForum(response.data));
      navigate(`/forum/${response.data.id}`);
    } catch (err) {
      setError('Error creating forum');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Forum
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
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
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            margin="normal"
            helperText="Enter tags separated by commas"
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
              .map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Create Forum
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              size="large"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateForum; 