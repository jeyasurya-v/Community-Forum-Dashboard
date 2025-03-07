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

// Get comments by forum ID
router.get('/forum/:forumId', async (req, res) => {
  try {
    const comments = await commentRepository.find({
      where: { forum: { id: parseInt(req.params.forumId) } },
      relations: ['user'],
    });
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Create comment
router.post('/forum/:forumId', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userRepository.findOne({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const forum = await forumRepository.findOne({
      where: { id: parseInt(req.params.forumId) },
    });

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
    return res.status(500).json({ message: 'Error creating comment' });
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
    await commentRepository.save(comment);
    return res.json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating comment' });
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
    return res.status(500).json({ message: 'Error deleting comment' });
  }
});

// Like comment
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

    comment.likes += 1;
    await commentRepository.save(comment);
    return res.json(comment);
  } catch (error) {
    return res.status(500).json({ message: 'Error liking comment' });
  }
});

export default router; 