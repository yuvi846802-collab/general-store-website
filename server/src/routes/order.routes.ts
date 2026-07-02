import { Router } from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Customer endpoints (requireAuth)
router.use(requireAuth);
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);

// Admin endpoints (requireAdmin)
router.get('/admin/all', requireAdmin, getAllOrders);
router.put('/admin/:id/status', requireAdmin, updateOrderStatus);

export default router;
