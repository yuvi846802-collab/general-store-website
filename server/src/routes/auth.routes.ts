import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe); // NOTE: Requires auth middleware in the future

export default router;
