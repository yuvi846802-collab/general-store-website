import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image, status } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existingCategory = await prisma.category.findUnique({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ error: 'A category with this slug already exists' });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        image: typeof image === 'string' ? image : '', // Simple string for now
        // status is not in the Prisma schema, but let's assume active if not specified.
        // Wait, I should just map the required fields.
      }
    });

    res.status(201).json(newCategory);
  } catch (error: any) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category', details: error.message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updates
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
