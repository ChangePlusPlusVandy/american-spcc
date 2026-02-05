import { Request, Response } from 'express';

export const createResourceLabel = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const { resource_id, label_id } = req.body;

    const resourceLabel = await prisma.resourceLabel.create({
      data: {
        resource_id,
        label_id,
      },
    });

    res.status(201).json(resourceLabel);
  } catch (error) {
    console.error('Error creating external resourceLabel:', error);
    res.status(500).json({ error: 'Failed to create resourceLabel' });
  }
};

export const getAllResourceLabels = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');

    const { resource_id } = req.query;
    const where = resource_id ? { resource_id: resource_id as string } : undefined;

    const labels = await prisma.resourceLabel.findMany({
      where,
    });

    res.json(labels);
  } catch (error) {
    console.error('Error fetching resourceLabels:', error);
    res.status(500).json({ error: 'Failed to fetch resourceLabels' });
  }
};

export const getResourceLabelById = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');

    const id = req.params.id as string;

    const label = await prisma.resourceLabel.findUnique({
      where: { id },
      include: { resource: true, label: true },
    });

    if (!label) {
      return res.status(404).json({ error: 'ResourceLabel not found' });
    }

    res.json(label);
  } catch (error) {
    console.error('Error fetching resourceLabel:', error);
    res.status(500).json({ error: 'Failed to fetch resourceLabel' });
  }
};

export const updateResourceLabel = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');

    const id = req.params.id as string;
    const { resource_id, label_id } = req.body;

    const updated = await prisma.resourceLabel.update({
      where: { id },
      data: { resource_id, label_id },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating resourceLabel:', error);
    res.status(500).json({ error: 'Failed to update resourceLabel' });
  }
};

export const deleteResourceLabel = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');

    const id = req.params.id as string;

    await prisma.resourceLabel.delete({
      where: { id },
    });

    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Error deleting resourceLabel:', error);
    res.status(500).json({ error: 'Failed to delete resourceLabel' });
  }
};
