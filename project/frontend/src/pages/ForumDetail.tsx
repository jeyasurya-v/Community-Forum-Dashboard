/**
 * ForumDetail Component
 * 
 * This component displays a detailed view of a forum post, including:
 * - Forum title, description, and tags
 * - Author information
 * - Like functionality
 * - Comments section with CRUD operations
 * - Edit and delete options for forum owner
 * 
 * The component implements optimistic updates for likes and comments to provide
 * a better user experience by updating the UI immediately before the server response.
 */

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
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ThumbUp, Comment, Edit, Delete } from '@mui/icons-material';
import { RootState } from '../redux/store';
import { forumAPI, commentAPI } from '../services/api';
import { setCurrentForum, updateForum } from '../redux/slices/forumSlice';

// Component interfaces
interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  likes: number;
  liked: boolean;
  createdAt: string;
}

interface Forum {
  id: number;
  title: string;
  description: string;
  tags: string[];
  user: {
    id: number;
    username: string;
  };
  likes: number;
  liked: boolean;
  comments: Comment[];
}

const ForumDetail: React.FC = () => {
  // Hooks and state
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentForum } = useSelector((state: RootState) => state.forums);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  /**
   * Fetches forum data when component mounts or ID changes
   * Includes error handling and loading state management
   */
  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await forumAPI.getById(parseInt(id!));
        dispatch(setCurrentForum(response.data));
      } catch (err) {
        setError('Error fetching forum details');
        console.error('Error fetching forum:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForum();
    }
  }, [id, dispatch]);

  /**
   * Handles forum like/unlike functionality
   * Implements optimistic updates for better UX
   */
  const handleLike = async (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents navigation in case of accidental `<a>` behavior
  
    if (!user) {
      navigate('/login');
      return;
    }
  
    try {  
      // Toggle like status and update likes count correctly
      dispatch(updateForum({
        ...currentForum!,
        liked: !currentForum!.liked, 
        likes: currentForum!.liked ? currentForum!.likes - 1 : currentForum!.likes + 1
      }));
  
      setSuccess('Like updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };
  

  /**
   * Handles comment like/unlike functionality
   * Implements optimistic updates for better UX
   */
  const handleCommentLike = async (commentId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
  
    try {
      // Optimistically update the comment's like count in UI
      dispatch(setCurrentForum({
        ...currentForum!,
        comments: currentForum!.comments.map(comment =>
          comment.id === commentId
            ? { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
            : comment
        ),
      }));
  
      setSuccess('Comment like updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error toggling comment like:', err);
    }
  };
  

  /**
   * Handles new comment submission
   * Updates UI immediately and handles errors appropriately
   */
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await commentAPI.create(parseInt(id!), { content: commentContent });
      dispatch(setCurrentForum({
        ...currentForum!,
        comments: [response.data, ...currentForum!.comments],
      }));
      setCommentContent('');
      setSuccess('Comment added successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  /**
   * Handles comment update functionality
   * Updates UI immediately and handles errors appropriately
   */
  const handleCommentUpdate = async (commentId: number) => {
    try {
      const response = await commentAPI.update(commentId, { content: editContent });
  
      dispatch(setCurrentForum({
        ...currentForum!,
        comments: currentForum!.comments.map(comment =>
          comment.id === commentId ? response.data : comment
        ),
      }));

      setEditingComment(null);
      setEditContent(''); // Clear edit content
      setSuccess('Comment updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };  

  /**
   * Handles comment deletion
   * Updates UI immediately and handles errors appropriately
   */
  const handleCommentDelete = async (commentId: number) => {
    try {
      await commentAPI.delete(commentId);
      dispatch(setCurrentForum({
        ...currentForum!,
        comments: currentForum!.comments.filter(comment => comment.id !== commentId),
      }));
      setSuccess('Comment deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (!currentForum) {
    return (
      <Container>
        <Alert severity="error">Forum not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {/* Success/Error messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Forum header */}
        <Typography variant="h4" component="h1" gutterBottom>
          {currentForum.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Posted by {currentForum.user.username}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {currentForum.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {currentForum.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ThumbUp />}
            color={currentForum.liked ? 'primary' : 'inherit'}
            onClick={handleLike}
            type="button"
            variant="text"
          >
            {currentForum.likes}
          </Button>
          <Button 
            startIcon={<Comment />}
            type="button"
          >
            {currentForum.comments.length} Comments
          </Button>
          {user && user.id === currentForum.user.id && (
            <>
              <Button
                startIcon={<Edit />}
                onClick={() => navigate(`/forum/${id}/edit`)}
                type="button"
              >
                Edit
              </Button>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this forum?')) {
                    forumAPI.delete(parseInt(id!));
                    navigate('/');
                  }
                }}
                type="button"
              >
                Delete
              </Button>
            </>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Comments section */}
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {user && (
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Write a comment..."
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!commentContent.trim()}
            >
              Post Comment
            </Button>
          </Box>
        )}

        {currentForum.comments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">
                {comment.user.username}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            {editingComment === comment.id ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    onClick={() => handleCommentUpdate(comment.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body2" paragraph>
                  {comment.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    startIcon={<ThumbUp />}
                    size="small"
                    color={comment.liked ? 'primary' : 'inherit'}
                    onClick={() => handleCommentLike(comment.id)}
                    type="button"
                    variant="text"
                  >
                    {comment.likes}
                  </Button>
                  {user && user.id === comment.user.id && (
                    <>
                      <Button
                        size="small"
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCommentDelete(comment.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default ForumDetail; 