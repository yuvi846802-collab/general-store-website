import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getSettings);
router.put('/', requireAuth, requireAdmin, updateSettings);

export default router;
