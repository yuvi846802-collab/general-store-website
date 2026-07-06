import express from 'express';
import { refreshInventory } from '../controllers/inventory.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/refresh', requireAuth, requireAdmin, refreshInventory);

export default router;
