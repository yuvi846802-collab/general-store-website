import { z } from 'zod';

export const createWhyChooseUsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(60, 'Title must be at most 60 characters').trim(),
  description: z.string().min(1, 'Description is required').max(300, 'Description must be at most 300 characters').trim(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateWhyChooseUsSchema = createWhyChooseUsSchema.partial();

export const updateOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int().min(0),
    })
  )
});
