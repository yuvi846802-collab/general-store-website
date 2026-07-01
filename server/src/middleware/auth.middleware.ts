import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-hakeem-store-key';

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
