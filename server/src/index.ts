import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { globalErrorHandler } from './middlewares/error.middleware';
import { AppError } from './utils/appError';

import http from 'http';
import { initSocket } from './utils/socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
initSocket(server);

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:5000", "http://localhost:5173", process.env.FRONTEND_URL || 'http://localhost:5173'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Increased limit to 1000 for development and heavy usage
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Parsing Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static files from public directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import settingsRoutes from './routes/settings.routes';
import heroRoutes from './routes/hero.routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import orderRoutes from './routes/order.routes';
import inventoryRoutes from './routes/inventory.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health Check
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Hakeem Store API is running' });
});

// Handle 404 for undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

// Start Server conditionally (skip in Vercel serverless environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

export default app;
