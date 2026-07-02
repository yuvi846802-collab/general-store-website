import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct, exportProducts } from '../controllers/product.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/export', requireAuth, requireAdmin, exportProducts);
router.post('/', requireAuth, requireAdmin, createProduct);
router.get('/', getProducts); // Public GET for storefront
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
