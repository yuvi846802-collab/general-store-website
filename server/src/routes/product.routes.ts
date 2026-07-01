import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createProduct);
router.get('/', getProducts); // Public GET for storefront
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
