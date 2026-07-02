import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.isOperational = err.isOperational === undefined ? true : err.isOperational;

  logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: 'error',
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak error details
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
      });
    }
  } else {
    // Development mode
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      stack: err.stack
    });
  }
};
