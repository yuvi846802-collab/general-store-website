import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, description, price, originalPrice, category, stock, isPopular, image,
      sku, barcode, tag, status
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
        sku: sku || null,
        barcode: barcode || null,
        tag: tag || null,
        status: status || 'active',
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1000; // default large limit to preserve backward compatibility for now
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count()
    ]);

    res.status(200).json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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

export const exportProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: 'No products available for export.' });
    }

    const headers = ['Product Name', 'SKU', 'Category', 'Price', 'Inventory', 'Status'];
    
    const escapeCSV = (field: any) => {
      if (field === null || field === undefined) return '""';
      const stringField = String(field);
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    const csvRows = [headers.map(escapeCSV).join(',')];

    products.forEach(product => {
      const row = [
        product.name,
        `HKM-${product.id.padStart(4, '0')}`,
        product.category?.name || 'Uncategorized',
        product.price,
        product.stock,
        product.stock === 0 ? 'Out of Stock' : 'Active'
      ];
      csvRows.push(row.map(escapeCSV).join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="products_export.csv"');
    
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export products error:', error);
    return res.status(500).json({ error: 'Failed to generate export file. Please try again.' });
  }
};
