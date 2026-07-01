import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signToken } from '../utils/token';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { sendEmail } from '../utils/email';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const prisma = new PrismaClient();
const REFRESH_TOKEN_EXPIRY_DAYS = 30;

const setTokenCookies = (res: Response, refreshToken: string) => {
  res.cookie('jwt_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  const { firstName, lastName, email, phone, password } = parsed.data;

  // Check if user exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return next(new AppError('Email already in use', 400));
  
  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) return next(new AppError('Phone number already in use', 400));

  const hashedPassword = await bcrypt.hash(password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }
  });

  // Send verification email
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Hakeem Store - Verify your email',
      message: `Please verify your email by making a POST request to: \n\n${verifyUrl}`
    });
  } catch (err) {
    console.error('Email error:', err);
    // Even if email fails, we register the user but log the error
  }

  res.status(201).json({
    status: 'success',
    message: 'Registration successful. Please check your email to verify your account.',
  });
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { email, password } = parsed.data;

  let user = await prisma.user.findUnique({ where: { email } });
  
  // Auto-Register if user doesn't exist
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isVerified: true, // Auto verify so they can buy products immediately
        role: 'USER',
      }
    });
    
    // Optional: Send Welcome Email in background
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Hakeem Store!',
        message: 'Your account has been created automatically. Happy Shopping!'
      });
    } catch (e) {
      console.log('Welcome email failed', e);
    }
  } else {
    // If user exists, check password and verification
    if (!(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid email or password', 401));
    }
    
    if (!user.isVerified) {
      return next(new AppError('Please verify your email first', 401));
    }
  }

  // Generate tokens
  const accessToken = signToken(user.id, user.role);
  const refreshTokenString = crypto.randomBytes(40).toString('hex');
  
  // Store session
  const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
  const ipAddress = req.ip || 'Unknown IP';
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: crypto.createHash('sha256').update(refreshTokenString).digest('hex'),
      deviceInfo,
      ipAddress,
      expiresAt
    }
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'LOGIN', ipAddress, userAgent: deviceInfo }
  });

  setTokenCookies(res, refreshTokenString);

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    status: 'success',
    accessToken,
    user: userWithoutPassword
  });
});

export const refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.jwt_refresh;
  if (!refreshToken) return next(new AppError('Not logged in. Please login again.', 401));

  const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await prisma.session.findUnique({
    where: { refreshToken: hashedToken },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    return next(new AppError('Session expired. Please log in again.', 401));
  }

  const accessToken = signToken(session.user.id, session.user.role);

  res.status(200).json({
    status: 'success',
    accessToken,
  });
});

export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.jwt_refresh;
  
  if (refreshToken) {
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.session.deleteMany({ where: { refreshToken: hashedToken } });
  }

  res.clearCookie('jwt_refresh', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  // Also clear old legacy cookie if present
  res.clearCookie('admin_token');

  res.status(200).json({ status: 'success' });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token, email } = req.body;
  if (!token || !email) return next(new AppError('Token and email are required', 400));

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await prisma.user.findFirst({
    where: {
      email,
      verificationToken: hashedToken,
      verificationTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null
    }
  });

  res.status(200).json({ status: 'success', message: 'Email successfully verified' });
});

export const resendVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return next(new AppError('User not found', 404));
  if (user.isVerified) return next(new AppError('Email is already verified', 400));

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: hashedVerificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });

  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}&email=${email}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Hakeem Store - Verify your email',
      message: `Please verify your email by making a POST request to: \n\n${verifyUrl}`
    });
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({ status: 'success', message: 'Verification email sent' });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return next(new AppError('There is no user with that email address.', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message: `Forgot your password? Reset it here: \n\n${resetUrl}\nIf you didn't forget your password, please ignore this email!`
    });
    res.status(200).json({ status: 'success', message: 'Token sent to email!' });
  } catch (err) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: null, resetPasswordExpiry: null }
    });
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const hashedToken = crypto.createHash('sha256').update(parsed.data.token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { gt: new Date() }
    }
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    }
  });

  // Log user in automatically after reset
  const accessToken = signToken(user.id, user.role);
  const refreshTokenString = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: crypto.createHash('sha256').update(refreshTokenString).digest('hex'),
      deviceInfo: req.headers['user-agent'],
      ipAddress: req.ip,
      expiresAt
    }
  });

  setTokenCookies(res, refreshTokenString);

  res.status(200).json({ status: 'success', accessToken });
});

export const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  if (!user) return next(new AppError('User not found', 404));

  const { password, ...userWithoutPassword } = user;
  res.status(200).json({ status: 'success', user: userWithoutPassword });
});
