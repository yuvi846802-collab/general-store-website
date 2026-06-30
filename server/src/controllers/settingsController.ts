import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.storeSettings.findFirst();
    
    if (!settings) {
      // If not exists, create a default one
      settings = await prisma.storeSettings.create({
        data: {} // Uses all defaults
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: 'Server error fetching settings' });
  }
};

// Update settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let settings = await prisma.storeSettings.findFirst();

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data
      });
    } else {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data
      });
    }

    res.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};
