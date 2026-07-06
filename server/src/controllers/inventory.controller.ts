import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../utils/prismaClient';

export const refreshInventory = catchAsync(async (req: Request, res: Response) => {
  // Fetch latest products
  const products = await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate statistics
  const totalSkuCount = products.length;
  const lowStockProducts = products.filter((p: any) => p.stock > 0 && p.stock < 10);
  const outOfStockProducts = products.filter((p: any) => p.stock === 0);
  const totalInventoryValue = products.reduce((acc: any, curr: any) => acc + (curr.price * curr.stock), 0);

  res.status(200).json({
    status: 'success',
    data: {
      products,
      stats: {
        totalSkuCount,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        totalInventoryValue
      }
    }
  });
});
