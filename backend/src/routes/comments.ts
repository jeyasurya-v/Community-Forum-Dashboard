import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Comment } from '../entities/Comment';
import { User } from '../entities/User';
import { Forum } from '../entities/Forum';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const commentRepository = AppDataSource.getRepository(Comment);
const userRepository = AppDataSource.getRepository(User);
const forumRepository = AppDataSource.getRepository(Forum);

// Store comment likes in memory (in production, use a database table)
const commentLikes = new Set<string>();

// Get comments by forum ID
router.get('/forum/:forumId', async (req, res) => {
  try {
    const comments = await commentRepository.find({
      where: { forum: { id: parseInt(req.params.forumId) } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ 
      message: 'Error fetching comments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create comment
router.post('/forum/:forumId', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const forum = await forumRepository.findOne({ where: { id: parseInt(req.params.forumId) } });
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    const comment = commentRepository.create({
      content: req.body.content,
      user,
      forum,
    });

    await commentRepository.save(comment);
    return res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ 
      message: 'Error creating comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await commentRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['user'],
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content;
    const updatedComment = await commentRepository.save(comment);
    return res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ 
      message: 'Error updating comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await commentRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['user'],
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await commentRepository.remove(comment);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ 
      message: 'Error deleting comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Like/Unlike comment
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const comment = await commentRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user has already liked
    const likeKey = `${req.user.userId}-${comment.id}`;
    if (commentLikes.has(likeKey)) {
      // Unlike
      commentLikes.delete(likeKey);
      comment.likes = Math.max(0, comment.likes - 1);
      await commentRepository.save(comment);
      return res.json({ ...comment, liked: false });
    } else {
      // Like
      commentLikes.add(likeKey);
      comment.likes += 1;
      await commentRepository.save(comment);
      return res.json({ ...comment, liked: true });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return res.status(500).json({ 
      message: 'Error toggling comment like',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 