import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  refresh, 
  forgotPassword, 
  resetPassword,
  verifyEmail,
  resendVerification,
  getMe
} from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', requireAuth, getMe);

export default router;
