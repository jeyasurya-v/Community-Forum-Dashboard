import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import { ThumbUp, Delete, Edit } from '@mui/icons-material';
import { RootState } from '../redux/store';
import { setCurrentForum, setLoading, setError } from '../redux/slices/forumSlice';
import { forumAPI, commentAPI } from '../services/api';

const ForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentForum, loading, error } = useSelector((state: RootState) => state.forums);
  const { user } = useSelector((state: RootState) => state.auth);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchForum = async () => {
      try {
        dispatch(setLoading(true));
        const response = await forumAPI.getById(parseInt(id!));
        dispatch(setCurrentForum(response.data));
      } catch (err) {
        dispatch(setError('Error fetching forum'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchForum();
  }, [dispatch, id]);

  const handleLike = async () => {
    try {
      await forumAPI.like(parseInt(id!));
      const response = await forumAPI.getById(parseInt(id!));
      dispatch(setCurrentForum(response.data));
    } catch (err) {
      console.error('Error liking forum:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await forumAPI.delete(parseInt(id!));
      navigate('/');
    } catch (err) {
      console.error('Error deleting forum:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await commentAPI.create(parseInt(id!), { content: comment });
      const response = await forumAPI.getById(parseInt(id!));
      dispatch(setCurrentForum(response.data));
      setComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await commentAPI.delete(commentId);
      const response = await forumAPI.getById(parseInt(id!));
      dispatch(setCurrentForum(response.data));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !currentForum) {
    return <Typography color="error">{error || 'Forum not found'}</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {currentForum.title}
          </Typography>
          {user && user.id === currentForum.user.id && (
            <Box>
              <IconButton onClick={handleDelete} color="error">
                <Delete />
              </IconButton>
              <IconButton onClick={() => navigate(`/forum/${id}/edit`)}>
                <Edit />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography color="textSecondary" gutterBottom>
          Posted by {currentForum.user.username}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {currentForum.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Typography paragraph>{currentForum.description}</Typography>
        <Button
          startIcon={<ThumbUp />}
          onClick={handleLike}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          {currentForum.likes} Likes
        </Button>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {user && (
          <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Post Comment
            </Button>
          </Box>
        )}

        {currentForum.comments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">{comment.user.username}</Typography>
              {user && user.id === comment.user.id && (
                <IconButton
                  size="small"
                  onClick={() => handleCommentDelete(comment.id)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
            <Typography variant="body2" color="textSecondary" paragraph>
              {comment.content}
            </Typography>
            <Button
              startIcon={<ThumbUp />}
              size="small"
              onClick={() => commentAPI.like(comment.id)}
            >
              {comment.likes} Likes
            </Button>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default ForumDetail; 