import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { createWhyChooseUsSchema, updateWhyChooseUsSchema, updateOrderSchema } from '../validators/why-choose-us.validator';

export const getFeatures = async (req: Request, res: Response) => {
  try {
    const features = await prisma.whyChooseUsFeature.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ status: 'success', data: features });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createWhyChooseUsSchema.parse(req.body);

    const existingFeature = await prisma.whyChooseUsFeature.findFirst({
      where: { title: validatedData.title, deletedAt: null },
    });

    if (existingFeature) {
      res.status(400).json({ status: 'error', message: 'A feature with this title already exists' });
      return;
    }

    // Get max display order
    const maxOrderFeature = await prisma.whyChooseUsFeature.findFirst({
      where: { deletedAt: null },
      orderBy: { displayOrder: 'desc' },
    });
    const displayOrder = validatedData.displayOrder ?? (maxOrderFeature?.displayOrder ?? -1) + 1;

    const feature = await prisma.whyChooseUsFeature.create({
      data: {
        ...validatedData,
        displayOrder,
        createdBy: req.user?.id,
      },
    });

    res.status(201).json({ status: 'success', message: 'Feature created successfully', data: feature });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.errors });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

export const updateFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validatedData = updateWhyChooseUsSchema.parse(req.body);

    const feature = await prisma.whyChooseUsFeature.findUnique({ where: { id } });
    if (!feature || feature.deletedAt) {
      res.status(404).json({ status: 'error', message: 'Feature not found' });
      return;
    }

    if (validatedData.title && validatedData.title !== feature.title) {
      const existingFeature = await prisma.whyChooseUsFeature.findFirst({
        where: { title: validatedData.title, id: { not: id }, deletedAt: null },
      });
      if (existingFeature) {
        res.status(400).json({ status: 'error', message: 'A feature with this title already exists' });
        return;
      }
    }

    const updatedFeature = await prisma.whyChooseUsFeature.update({
      where: { id },
      data: {
        ...validatedData,
        updatedBy: req.user?.id,
      },
    });

    res.json({ status: 'success', message: 'Feature updated successfully', data: updatedFeature });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.errors });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

export const deleteFeature = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const feature = await prisma.whyChooseUsFeature.findUnique({ where: { id } });
    if (!feature || feature.deletedAt) {
      res.status(404).json({ status: 'error', message: 'Feature not found' });
      return;
    }

    await prisma.whyChooseUsFeature.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: req.user?.id },
    });

    res.json({ status: 'success', message: 'Feature deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const toggleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'ACTIVE' && status !== 'INACTIVE') {
      res.status(400).json({ status: 'error', message: 'Invalid status' });
      return;
    }

    const feature = await prisma.whyChooseUsFeature.findUnique({ where: { id } });
    if (!feature || feature.deletedAt) {
      res.status(404).json({ status: 'error', message: 'Feature not found' });
      return;
    }

    const updatedFeature = await prisma.whyChooseUsFeature.update({
      where: { id },
      data: { status, updatedBy: req.user?.id },
    });

    res.json({ status: 'success', message: 'Status updated successfully', data: updatedFeature });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = updateOrderSchema.parse(req.body);

    await prisma.$transaction(
      validatedData.items.map((item) =>
        prisma.whyChooseUsFeature.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder, updatedBy: req.user?.id },
        })
      )
    );

    res.json({ status: 'success', message: 'Order updated successfully' });
  } catch (error: any) {
    if (error.errors) {
      res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.errors });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
