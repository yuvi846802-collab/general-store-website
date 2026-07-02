import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { AppError } from '../utils/appError';
import prisma from '../utils/prismaClient';

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    // Check if token exists in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or session expired. Please log in again.', 401));
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN' && req.user?.role !== 'SUPER_ADMIN') {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
