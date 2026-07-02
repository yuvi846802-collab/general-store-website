import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
}
const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request to include user payload
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // Try to get token from cookie first, fallback to Authorization header
  const token = req.cookies.admin_token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    next(error);
  }
};
