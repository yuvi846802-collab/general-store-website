import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, description, price, originalPrice, category, stock, isPopular, image
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Find the category to connect
    let categoryRecord;
    if (category) {
      // Find category by name or slug
      categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });
      // If category doesn't exist, create a dummy one for now to prevent errors
      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: {
            name: category,
            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: '',
            image: ''
          }
        });
      }
    } else {
      return res.status(400).json({ error: 'Category is required' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: stock ? parseInt(stock) : 0,
        isPopular: isPopular || false,
        image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        categoryId: categoryRecord.id
      }
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Optional: handle category string to ID conversion if updating category
    if (updates.category) {
      let categoryRecord = await prisma.category.findFirst({
        where: { name: updates.category }
      });
      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: {
            name: updates.category,
            slug: updates.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: '',
            image: ''
          }
        });
      }
      updates.categoryId = categoryRecord.id;
      delete updates.category;
    }

    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
    if (updates.stock) updates.stock = parseInt(updates.stock);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updates,
      include: { category: true }
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
