import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get active slides for the frontend
export const getActiveSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hero slides' });
  }
};

// Get all slides for admin panel
export const getAllSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all hero slides' });
  }
};

// Create a new slide
export const createSlide = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Get max display order
    const maxOrderSlide = await prisma.heroSlide.findFirst({
      orderBy: { displayOrder: 'desc' }
    });
    const newOrder = maxOrderSlide ? maxOrderSlide.displayOrder + 1 : 0;

    const newSlide = await prisma.heroSlide.create({
      data: {
        ...data,
        displayOrder: newOrder,
      },
    });
    res.status(201).json(newSlide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create slide' });
  }
};

// Update a slide
export const updateSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedSlide = await prisma.heroSlide.update({
      where: { id },
      data,
    });
    res.json(updatedSlide);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slide' });
  }
};

// Delete a slide
export const deleteSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.heroSlide.delete({
      where: { id },
    });
    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete slide' });
  }
};

// Reorder slides
export const reorderSlides = async (req: Request, res: Response) => {
  try {
    const { slides } = req.body; // Array of { id, displayOrder }
    
    await prisma.$transaction(
      slides.map((slide: any) => 
        prisma.heroSlide.update({
          where: { id: slide.id },
          data: { displayOrder: slide.displayOrder },
        })
      )
    );
    
    res.json({ message: 'Slides reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder slides' });
  }
};
