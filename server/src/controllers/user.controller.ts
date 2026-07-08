import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import bcrypt from 'bcryptjs';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { getIO } from '../utils/socket';
import { sendEmail } from '../utils/email';

export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, phone, profileImage, bio, country, state, city, address, timezone, language, email, gender, dateOfBirth } = req.body;
  const userId = req.user?.id;

  const dataToUpdate: any = {};
  
  if (firstName && lastName) dataToUpdate.name = `${firstName} ${lastName}`;
  else if (firstName && !lastName) dataToUpdate.name = firstName;
  else if (!firstName && lastName) dataToUpdate.name = lastName;

  if (firstName !== undefined) dataToUpdate.firstName = firstName;
  if (lastName !== undefined) dataToUpdate.lastName = lastName;
  
  if (profileImage !== undefined) dataToUpdate.profileImage = profileImage;
  if (bio !== undefined) dataToUpdate.bio = bio;
  if (country !== undefined) dataToUpdate.country = country;
  if (state !== undefined) dataToUpdate.state = state;
  if (city !== undefined) dataToUpdate.city = city;
  if (address !== undefined) dataToUpdate.address = address;
  if (timezone !== undefined) dataToUpdate.timezone = timezone;
  if (language !== undefined) dataToUpdate.language = language;
  if (gender !== undefined) dataToUpdate.gender = gender;
  if (dateOfBirth !== undefined) dataToUpdate.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  const { password, ...userWithoutPassword } = updatedUser;
  
  // Emit event to notify clients of profile update
  try {
    getIO().emit('profileUpdated', { userId: updatedUser.id, user: userWithoutPassword });
  } catch (err) {
    console.error('Socket error emitting profileUpdated', err);
  }

  res.status(200).json({ status: 'success', user: userWithoutPassword });
});

export const uploadAvatar = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  const imageUrl = `/uploads/avatars/${req.file.filename}`;
  const userId = req.user?.id;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: imageUrl }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  
  const io = getIO();
  io.emit('profileUpdated', { userId, user: userWithoutPassword });

  res.status(200).json({ status: 'success', user: userWithoutPassword, url: imageUrl });
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
    select: { 
      id: true, 
      name: true, 
      email: true, 
      phone: true, 
      role: true, 
      isVerified: true, 
      createdAt: true,
      _count: { select: { orders: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ status: 'success', users });
});

export const requestEmailChange = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && existingUser.id !== req.user?.id) {
    return next(new AppError('Email is already in use', 400));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Invalidate previous ones
  await prisma.otp.updateMany({
    where: { userId: req.user?.id, purpose: 'CHANGE_EMAIL', isVerified: false },
    data: { attempts: 99 }
  });

  await prisma.otp.create({
    data: {
      userId: req.user?.id,
      email,
      otpHash,
      purpose: 'CHANGE_EMAIL',
      expiresAt
    }
  });

  try {
    await sendEmail({
      email,
      subject: 'Hakeem Store - Verify Email Change',
      message: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    });
    console.log(`[EMAIL OTP] CHANGE_EMAIL to ${email}: ${otp}`);
  } catch (err) {
    console.error('Email error:', err);
  }

  res.status(200).json({ status: 'success', message: 'OTP sent to your new email' });
});

export const verifyEmailChange = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  
  const otpRecord = await prisma.otp.findFirst({
    where: { userId: req.user?.id, email, purpose: 'CHANGE_EMAIL', isVerified: false },
    orderBy: { createdAt: 'desc' }
  });

  if (!otpRecord) return next(new AppError('No active request found', 404));
  if (otpRecord.attempts >= 3) return next(new AppError('Max attempts exceeded', 400));
  if (otpRecord.expiresAt < new Date()) return next(new AppError('OTP expired', 400));

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) {
    await prisma.otp.update({ where: { id: otpRecord.id }, data: { attempts: otpRecord.attempts + 1 } });
    return next(new AppError('Invalid OTP', 400));
  }

  await prisma.otp.update({ where: { id: otpRecord.id }, data: { isVerified: true } });

  const updatedUser = await prisma.user.update({
    where: { id: req.user?.id },
    data: { email }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  getIO().emit('profileUpdated', { userId: updatedUser.id, user: userWithoutPassword });

  res.status(200).json({ status: 'success', message: 'Email updated successfully', user: userWithoutPassword });
});

export const requestPhoneChange = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;
  if (!phone) return next(new AppError('Phone is required', 400));

  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser && existingUser.id !== req.user?.id) {
    return next(new AppError('Phone is already in use', 400));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Invalidate previous
  await prisma.otp.updateMany({
    where: { userId: req.user?.id, purpose: 'CHANGE_PHONE', isVerified: false },
    data: { attempts: 99 }
  });

  await prisma.otp.create({
    data: {
      userId: req.user?.id,
      phone,
      otpHash,
      purpose: 'CHANGE_PHONE',
      expiresAt
    }
  });

  console.log(`[SMS OTP] CHANGE_PHONE to ${phone}: ${otp}`);

  res.status(200).json({ status: 'success', message: 'OTP sent to your new phone number' });
});

export const verifyPhoneChange = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phone, otp } = req.body;
  
  const otpRecord = await prisma.otp.findFirst({
    where: { userId: req.user?.id, phone, purpose: 'CHANGE_PHONE', isVerified: false },
    orderBy: { createdAt: 'desc' }
  });

  if (!otpRecord) return next(new AppError('No active request found', 404));
  if (otpRecord.attempts >= 3) return next(new AppError('Max attempts exceeded', 400));
  if (otpRecord.expiresAt < new Date()) return next(new AppError('OTP expired', 400));

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) {
    await prisma.otp.update({ where: { id: otpRecord.id }, data: { attempts: otpRecord.attempts + 1 } });
    return next(new AppError('Invalid OTP', 400));
  }

  await prisma.otp.update({ where: { id: otpRecord.id }, data: { isVerified: true } });

  const updatedUser = await prisma.user.update({
    where: { id: req.user?.id },
    data: { phone }
  });

  const { password, ...userWithoutPassword } = updatedUser;
  getIO().emit('profileUpdated', { userId: updatedUser.id, user: userWithoutPassword });

  res.status(200).json({ status: 'success', message: 'Phone updated successfully', user: userWithoutPassword });
});
