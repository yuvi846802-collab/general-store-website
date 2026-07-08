import express from 'express';
import { getFeatures, createFeature, updateFeature, deleteFeature, toggleStatus, updateOrder } from '../controllers/why-choose-us.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getFeatures);
router.post('/', requireAuth, requireAdmin, createFeature);
router.put('/:id', requireAuth, requireAdmin, updateFeature);
router.delete('/:id', requireAuth, requireAdmin, deleteFeature);
router.patch('/status/:id', requireAuth, requireAdmin, toggleStatus);
router.patch('/order/update', requireAuth, requireAdmin, updateOrder);

export default router;
