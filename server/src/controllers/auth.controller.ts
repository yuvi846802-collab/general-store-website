import { Request, Response, NextFunction } from 'express';
import { UAParser } from 'ua-parser-js';
import prisma from '../utils/prismaClient';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { signToken } from '../utils/token';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { sendEmail } from '../utils/email';
import { 
  signupSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/auth.validator';

const REFRESH_TOKEN_EXPIRY_DAYS = 30;

const setTokenCookies = (res: Response, refreshToken: string, accessToken?: string) => {
  res.cookie('jwt_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  });

  if (accessToken) {
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
};

// --- OTP GENERATION HELPER ---
const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

// --- LOGIN SUCCESS HELPER ---
const performLogin = async (req: Request, res: Response, user: any, actionType: string) => {
  // Generate tokens
  const accessToken = signToken(user.id, user.role);
  const refreshTokenString = crypto.randomBytes(40).toString('hex');
  
  // Store session
  const deviceInfo = req.headers['user-agent'] || 'Unknown Device';
  const parser = new UAParser(deviceInfo);
  const uaResult = parser.getResult();
  const browser = uaResult.browser.name ? `${uaResult.browser.name} ${uaResult.browser.major || ''}`.trim() : 'Unknown Browser';
  const os = uaResult.os.name ? `${uaResult.os.name} ${uaResult.os.version || ''}`.trim() : 'Unknown OS';
  const deviceType = uaResult.device.type || (uaResult.device.model ? uaResult.device.model : 'Desktop');
  const ipAddress = req.ip || 'Unknown IP';
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: crypto.createHash('sha256').update(refreshTokenString).digest('hex'),
      deviceInfo,
      browser,
      os,
      deviceType,
      ipAddress,
      expiresAt
    }
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: actionType, ipAddress, userAgent: deviceInfo }
  });

  setTokenCookies(res, refreshTokenString, accessToken);

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({
    status: 'success',
    accessToken,
    user: userWithoutPassword
  });
};

// Generate, Hash, and Store OTP
const processAndSendOtp = async (
  identifier: string,
  purpose: string,
  userId: string | null = null,
  isPhone: boolean = false
) => {
  // Invalidate any existing pending OTPs for this purpose and identifier
  await prisma.otp.updateMany({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
      purpose,
      isVerified: false
    },
    data: { attempts: 99 } // effectively invalidating it
  });

  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins strict

  await prisma.otp.create({
    data: {
      userId,
      email: isPhone ? null : identifier,
      phone: isPhone ? identifier : null,
      otpHash,
      purpose,
      expiresAt,
    }
  });

  if (!isPhone) {
    try {
      await sendEmail({
        email: identifier,
        subject: `Hakeem Store - Your OTP for ${purpose}`,
        message: `Your OTP is: ${otp}. It will expire in 5 minutes.`
      });
      console.log(`[EMAIL OTP] ${purpose} to ${identifier}: ${otp}`);
    } catch (err) {
      console.error('Email error:', err);
      throw new AppError('Failed to send OTP via email', 500);
    }
  } else {
    // Send SMS (Mocked for now until API gateway is integrated)
    console.log(`[SMS OTP] ${purpose} to ${identifier}: ${otp}`);
  }
};


// 1. SIGNUP REQUEST
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { firstName, lastName, email, phone, password } = parsed.data;

  // Check duplicate email
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) return next(new AppError('Email already in use', 400));
  
  // Check duplicate phone
  const existingPhone = await prisma.user.findUnique({ where: { phone } });
  if (existingPhone) return next(new AppError('Phone number already in use', 400));

  // Store password securely immediately so we don't have to pass it later, but user remains unverified
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      password: hashedPassword,
      isVerified: false
    }
  });

  await processAndSendOtp(email, 'SIGNUP', user.id, false);
  await processAndSendOtp(phone, 'SIGNUP', user.id, true);

  res.status(200).json({ status: 'success', message: 'OTP sent successfully to email and phone' });
});


// 2. LOGIN REQUEST
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] }
  });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Bypass OTP for admins
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return performLogin(req, res, user, 'LOGIN_SUCCESS');
  }

  const isPhone = !identifier.includes('@');
  await processAndSendOtp(identifier, 'LOGIN', user.id, isPhone);

  res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});


// 3. SEND GENERIC OTP (Useful for change-email/change-phone if needed, though they have dedicated routes)
export const sendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = sendOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier, purpose } = parsed.data;
  const isPhone = !identifier.includes('@');
  
  // We can optionally verify user existence based on purpose here, 
  // but let's assume it's handled by specific controller methods usually.
  await processAndSendOtp(identifier, purpose, null, isPhone);

  res.status(200).json({ status: 'success', message: 'OTP sent' });
});


// 4. RESEND OTP
export const resendOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = sendOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier, purpose } = parsed.data;
  const isPhone = !identifier.includes('@');

  // Find recent OTP for resend tracking
  const recentOtp = await prisma.otp.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }], purpose },
    orderBy: { createdAt: 'desc' }
  });

  if (recentOtp) {
    if (recentOtp.resends >= 5) {
      return next(new AppError('Maximum resend limit reached. Please try again later.', 429));
    }
    // Check 60s cooldown
    const secondsSinceLast = (Date.now() - recentOtp.createdAt.getTime()) / 1000;
    if (secondsSinceLast < 60) {
      return next(new AppError(`Please wait ${Math.ceil(60 - secondsSinceLast)} seconds before resending.`, 429));
    }
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpHash = await bcrypt.hash(otp, 12);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Invalidate old OTPs
  await prisma.otp.updateMany({
    where: { OR: [{ email: identifier }, { phone: identifier }], purpose, isVerified: false },
    data: { attempts: 99 }
  });

  await prisma.otp.create({
    data: {
      userId: recentOtp?.userId,
      email: isPhone ? null : identifier,
      phone: isPhone ? identifier : null,
      otpHash,
      purpose,
      expiresAt,
      resends: (recentOtp?.resends || 0) + 1
    }
  });

  if (!isPhone) {
    try {
      await sendEmail({
        email: identifier,
        subject: `Hakeem Store - Resent OTP for ${purpose}`,
        message: `Your new OTP is: ${otp}. It will expire in 5 minutes.`
      });
      console.log(`[EMAIL OTP RESEND] ${purpose} to ${identifier}: ${otp}`);
    } catch (err) {
      return next(new AppError('Failed to send OTP', 500));
    }
  } else {
    console.log(`[SMS OTP RESEND] ${purpose} to ${identifier}: ${otp}`);
  }

  res.status(200).json({ status: 'success', message: 'New OTP sent' });
});


// 5. VERIFY OTP
export const verifyOtp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = verifyOtpSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier, purpose, otp } = parsed.data;

  const otpRecord = await prisma.otp.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
      purpose,
      isVerified: false
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!otpRecord) return next(new AppError('No pending OTP request found', 404));

  if (otpRecord.attempts >= 3) {
    return next(new AppError('Maximum attempts exceeded. Please request a new OTP.', 400));
  }

  if (otpRecord.expiresAt < new Date()) {
    return next(new AppError('OTP expired. Please request a new one.', 400));
  }

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  
  if (!isValid) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 }
    });
    return next(new AppError('Invalid OTP', 400));
  }

  // Mark verified
  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: { isVerified: true }
  });

  // Action based on purpose
  if (purpose === 'SIGNUP' || purpose === 'LOGIN') {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] }
    });

    if (!user) return next(new AppError('User not found', 404));

    if (purpose === 'SIGNUP' && !user.isVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
      });
    }

    // Generate tokens and finish login using helper
    return performLogin(req, res, user, `${purpose}_SUCCESS`);
  }
  
  if (purpose === 'FORGOT_PASSWORD') {
    // Return a verification token that allows resetting password
    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { email: identifier },
      data: {
        resetPasswordToken: await bcrypt.hash(resetToken, 12),
        resetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000)
      }
    });
    return res.status(200).json({ status: 'success', resetToken });
  }

  res.status(200).json({ status: 'success', message: 'OTP verified successfully' });
});


// 6. FORGOT PASSWORD (Request OTP)
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] }
  });

  if (!user) return next(new AppError('No account found with this email or phone.', 404));

  const isPhone = !identifier.includes('@');
  await processAndSendOtp(identifier, 'FORGOT_PASSWORD', user.id, isPhone);

  res.status(200).json({ status: 'success', message: 'OTP sent to your email or phone.' });
});

// 7. RESET PASSWORD (Uses OTP instead of email link)
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });

  const { identifier, otp, password } = parsed.data;

  // Verify OTP first securely
  const otpRecord = await prisma.otp.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }], purpose: 'FORGOT_PASSWORD', isVerified: false },
    orderBy: { createdAt: 'desc' }
  });

  if (!otpRecord) return next(new AppError('No active password reset request found.', 404));
  if (otpRecord.attempts >= 3) return next(new AppError('Max attempts exceeded.', 400));
  if (otpRecord.expiresAt < new Date()) return next(new AppError('OTP expired.', 400));

  const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isValid) {
    await prisma.otp.update({ where: { id: otpRecord.id }, data: { attempts: otpRecord.attempts + 1 }});
    return next(new AppError('Invalid OTP', 400));
  }

  // Mark verified
  await prisma.otp.update({ where: { id: otpRecord.id }, data: { isVerified: true } });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] }
  });

  if (!user) return next(new AppError('User not found', 404));

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpiry: null }
  });

  // Invalidate all sessions
  await prisma.session.deleteMany({ where: { userId: user.id } });

  // Login automatically
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

  setTokenCookies(res, refreshTokenString, accessToken);

  res.status(200).json({ status: 'success', message: 'Password reset successfully', accessToken, user: { ...user, password: '' } });
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

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

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

  res.clearCookie('jwt_refresh');
  res.clearCookie('jwt');
  res.clearCookie('admin_token');

  res.status(200).json({ status: 'success' });
});
