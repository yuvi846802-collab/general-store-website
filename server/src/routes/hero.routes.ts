import { Router } from 'express';
import { getActiveSlides, getAllSlides, createSlide, updateSlide, deleteSlide, reorderSlides } from '../controllers/hero.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public route for frontend to get active slides
router.get('/', getActiveSlides);

// Admin routes (protected)
router.get('/admin', requireAuth, requireAdmin, getAllSlides);
router.post('/', requireAuth, requireAdmin, createSlide);
router.put('/reorder', requireAuth, requireAdmin, reorderSlides);
router.put('/:id', requireAuth, requireAdmin, updateSlide);
router.delete('/:id', requireAuth, requireAdmin, deleteSlide);

export default router;
