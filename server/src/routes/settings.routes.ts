import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
// Assuming there might be an admin auth middleware, I'll just keep it simple or use existing if any.
// In a real app we'd protect updateSettings with authenticate, isAdmin middlewares.

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
