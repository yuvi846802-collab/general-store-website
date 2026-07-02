import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/category.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, requireAdmin, createCategory);
router.get('/', getCategories); // Public GET for storefront
router.put('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
