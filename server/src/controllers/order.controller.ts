import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prismaClient';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { z } from 'zod';
import { getIO } from '../utils/socket';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddress: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError('You must be logged in to place an order', 401));
  }

  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0]?.message || 'Invalid order payload' });
  }

  const { items } = parsed.data;

  // Verify stock and calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      return next(new AppError(`Product with id ${item.productId} not found`, 404));
    }
    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for product: ${product.name}`, 400));
    }
    totalAmount += item.price * item.quantity;
  }

  // Transaction: Create Order, OrderItems, and update Stock
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Deduct stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newOrder;
  });

  res.status(201).json({ status: 'success', order });
});

export const getUserOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError('Unauthorized', 401));
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ status: 'success', orders });
});

export const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, image: true, price: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ status: 'success', orders });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!status || !validStatuses.includes(status)) {
    return next(new AppError('Invalid order status provided', 400));
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  getIO().emit('inventory:updated');
  res.status(200).json({ status: 'success', order: updatedOrder });
});
