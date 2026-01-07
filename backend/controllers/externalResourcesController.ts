import { Request, Response } from 'express';

export const createExternalResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const { resource_fk, external_url } = req.body;

    const externalResources = await prisma.externalResources.create({
      data: {
        resource_fk,
        external_url,
      },
    });

    res.status(201).json(externalResources);
  } catch (error) {
    console.error('Error creating external resources:', error);
    res.status(500).json({ error: 'Failed to create externalResources' });
  }
};

export const getAllExternalResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const allExternalResources = await prisma.externalResources.findMany();
    res.json(allExternalResources);
  } catch (error) {
    console.error('Error fetching external resources:', error);
    res.status(500).json({ error: 'Failed to fetch externalResources' });
  }
};

export const getExternalResourcesById = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;
    const externalResources = await prisma.externalResources.findUnique({
      where: { id },
      include: { resource: true },
    });

    if (!externalResources) return res.status(404).json({ error: 'externalResources not found' });
    res.json(externalResources);
  } catch (error) {
    console.error('Error fetching external resources:', error);
    res.status(500).json({ error: 'Failed to fetch externalResources' });
  }
};

export const updateExternalResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;
    const { resource_fk, external_url } = req.body;

    const updated = await prisma.externalResources.update({
      where: { id },
      data: { resource_fk, external_url },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating externalResources:', error);
    res.status(500).json({ error: 'Failed to update externalResources' });
  }
};

export const deleteExternalResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;
    await prisma.externalResources.delete({ where: { id } });
    res.json({ message: 'External resources deleted successfully' });
  } catch (error) {
    console.error('Error deleting externalResources:', error);
    res.status(500).json({ error: 'Failed to delete externalResources' });
  }
};
