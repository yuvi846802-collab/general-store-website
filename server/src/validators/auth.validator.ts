import { z } from 'zod';

// SIGNUP
export const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// LOGIN
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

// SEND OTP / RESEND OTP
export const sendOtpSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  purpose: z.enum(['SIGNUP', 'LOGIN', 'FORGOT_PASSWORD', 'CHANGE_EMAIL', 'CHANGE_PHONE']),
});

// VERIFY OTP
export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  purpose: z.enum(['SIGNUP', 'LOGIN', 'FORGOT_PASSWORD', 'CHANGE_EMAIL', 'CHANGE_PHONE']),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

// FORGOT PASSWORD
export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
});

// RESET PASSWORD
export const resetPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// CHANGE EMAIL
export const changeEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// CHANGE PHONE
export const changePhoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});
