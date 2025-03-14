import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Forum } from '../entities/Forum';
import { User } from '../entities/User';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const forumRepository = AppDataSource.getRepository(Forum);
const userRepository = AppDataSource.getRepository(User);

// Store likes in memory (in production, use a database table)
const likes = new Set<string>();

// Get all forums
router.get('/', async (_req, res) => {
  try {
    const forums = await forumRepository.find({
      relations: ['user', 'comments', 'comments.user'],
      order: { createdAt: 'DESC' },
    });
    return res.json(forums);
  } catch (error) {
    console.error('Error fetching forums:', error);
    return res.status(500).json({ 
      message: 'Error fetching forums',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get forum by ID
router.get('/:id', async (req, res) => {
  try {
    const forum = await forumRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    return res.json(forum);
  } catch (error) {
    console.error('Error fetching forum:', error);
    return res.status(500).json({ 
      message: 'Error fetching forum',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create forum
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const forum = forumRepository.create({
      ...req.body,
      user,
    });

    await forumRepository.save(forum);
    return res.status(201).json(forum);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating forum' });
  }
});

// Update forum
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const forum = await forumRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['user', 'comments', 'comments.user'],
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.user.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this forum' });
    }

    // Update only allowed fields
    const { title, description, tags } = req.body;
    forum.title = title;
    forum.description = description;
    forum.tags = tags;

    const updatedForum = await forumRepository.save(forum);
    return res.json(updatedForum);
  } catch (error) {
    console.error('Error updating forum:', error);
    return res.status(500).json({ 
      message: 'Error updating forum',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete forum
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const forum = await forumRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['user'],
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    if (forum.user.id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this forum' });
    }

    await forumRepository.remove(forum);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting forum' });
  }
});

// Like/Unlike forum
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const forum = await forumRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }

    // Check if user has already liked
    const likeKey = `${req.user.userId}-${forum.id}`;
    if (likes.has(likeKey)) {
      // Unlike
      likes.delete(likeKey);
      forum.likes = Math.max(0, forum.likes - 1);
      await forumRepository.save(forum);
      return res.json({ ...forum, liked: false });
    } else {
      // Like
      likes.add(likeKey);
      forum.likes += 1;
      await forumRepository.save(forum);
      return res.json({ ...forum, liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ 
      message: 'Error toggling like',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 