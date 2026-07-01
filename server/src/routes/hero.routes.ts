import { Router } from 'express';
import { getActiveSlides, getAllSlides, createSlide, updateSlide, deleteSlide, reorderSlides } from '../controllers/hero.controller';

const router = Router();

// Public route for frontend to get active slides
router.get('/', getActiveSlides);

// Admin routes
router.get('/admin', getAllSlides);
router.post('/', createSlide);
router.put('/reorder', reorderSlides);
router.put('/:id', updateSlide);
router.delete('/:id', deleteSlide);

export default router;
