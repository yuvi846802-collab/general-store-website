import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const prisma = new PrismaClient();

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, phone } = req.body;
  const userId = req.user?.id;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { firstName, lastName, phone, name: `${firstName} ${lastName}` }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  res.status(200).json({ status: 'success', user: userWithoutPassword });
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.id;

  if (newPassword !== confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  res.status(200).json({ status: 'success', message: 'Password updated successfully' });
});

export const getSessions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const sessions = await prisma.session.findMany({
    where: { userId: req.user?.id },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({ status: 'success', sessions });
});

export const revokeSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const session = await prisma.session.findUnique({ where: { id } });

  if (!session || session.userId !== req.user?.id) {
    return next(new AppError('Session not found', 404));
  }

  await prisma.session.delete({ where: { id } });
  res.status(200).json({ status: 'success', message: 'Session revoked' });
});

export const revokeAllSessions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const currentRefreshToken = req.cookies.jwt_refresh; // Optional: keep current session alive
  
  await prisma.session.deleteMany({
    where: { userId: req.user?.id }
  });

  res.clearCookie('jwt_refresh');
  res.status(200).json({ status: 'success', message: 'All sessions revoked. Logged out.' });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true, createdAt: true }
  });
  res.status(200).json({ status: 'success', users });
});
