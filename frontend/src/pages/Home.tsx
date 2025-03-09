import React, { useEffect, useState } from 'react';
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
  Container,
  TextField,
  Pagination,
  Skeleton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { ThumbUp, Comment, Search } from '@mui/icons-material';
import { RootState } from '../redux/store';
import { setForums, setLoading, setError } from '../redux/slices/forumSlice';
import { forumAPI } from '../services/api';

const ITEMS_PER_PAGE = 10;

const ForumCard = ({ forum, onLike }: { forum: any; onLike: (id: number) => void }) => (
  <Card sx={{ 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6,
    }
  }}>
    <CardContent sx={{ flexGrow: 1 }}>
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
        {forum.tags?.map((tag: string) => (
          <Chip key={tag} label={tag} size="small" />
        ))}
      </Box>
    </CardContent>
    <CardActions>
      <Button 
        startIcon={<ThumbUp />} 
        size="small"
        color={forum.liked ? 'primary' : 'inherit'}
        onClick={() => onLike(forum.id)}
      >
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
);

const LoadingCard = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Skeleton variant="text" height={32} />
      <Skeleton variant="text" height={24} />
      <Skeleton variant="text" height={100} />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Skeleton variant="rectangular" width={60} height={24} />
      </Box>
    </CardContent>
    <CardActions>
      <Skeleton variant="rectangular" width={80} height={32} />
    </CardActions>
  </Card>
);

const Home = () => {
  const dispatch = useDispatch();
  const { forums, loading, error } = useSelector((state: RootState) => state.forums);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredForums, setFilteredForums] = useState<any[]>([]);

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

  useEffect(() => {
    const filtered = forums.filter(forum =>
      forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredForums(filtered);
    setPage(1);
  }, [forums, searchQuery]);

  const handleLike = async (forumId: number) => {
    try {
      // Find the forum to update
      const forumToUpdate = forums.find(f => f.id === forumId);
      if (!forumToUpdate) return;

      // Optimistically update UI
      dispatch(setForums(forums.map(forum => 
        forum.id === forumId 
          ? { 
              ...forum, 
              liked: !forum.liked, 
              likes: forum.liked ? forum.likes - 1 : forum.likes + 1 
            }
          : forum
      )));

      // Make API call
      await forumAPI.like(forumId);

      // Update the forum data to ensure consistency
      const response = await forumAPI.getById(forumId);
      dispatch(setForums(forums.map(forum => 
        forum.id === forumId ? response.data : forum
      )));
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert on error by fetching all forums
      const response = await forumAPI.getAll();
      dispatch(setForums(response.data));
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedForums = filteredForums.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredForums.length / ITEMS_PER_PAGE);

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
          }}
        >
          Community Forums
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search forums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
          {loading ? (
            Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={10} md={8} key={index}>
                <LoadingCard />
              </Grid>
            ))
          ) : (
            paginatedForums.map((forum) => (
              <Grid item xs={12} sm={10} md={8} key={forum.id}>
                <ForumCard forum={forum} onLike={handleLike} />
              </Grid>
            ))
          )}
        </Grid>

        {!loading && filteredForums.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: { xs: 2, sm: 3, md: 4 },
            '& .MuiPagination-ul': {
              flexWrap: 'wrap',
              justifyContent: 'center'
            }
          }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {!loading && filteredForums.length === 0 && (
          <Typography align="center" color="textSecondary">
            No forums found matching your search.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Home; 