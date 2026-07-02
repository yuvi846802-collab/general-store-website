import { Router } from 'express';
import { 
  updateProfile, 
  updatePassword, 
  getSessions, 
  revokeSession, 
  revokeAllSessions,
  getAllUsers
} from '../controllers/user.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes after this middleware
router.use(requireAuth);

router.put('/profile', updateProfile);
router.put('/update-password', updatePassword);

router.get('/sessions', getSessions);
router.delete('/sessions/:id', revokeSession);
router.delete('/sessions', revokeAllSessions);

// Admin only routes
router.use(requireAdmin);
router.get('/', getAllUsers);

export default router;
