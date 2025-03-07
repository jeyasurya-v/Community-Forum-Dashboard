import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '1234567890'
    ) as JwtPayload;
    
    if (!decoded.userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}; 