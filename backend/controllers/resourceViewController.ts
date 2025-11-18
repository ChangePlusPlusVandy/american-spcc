import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const recordResourceView = async (req: Request, res: Response) => {
  try {
    const { user_fk, resource_fk } = req.body;

    if (!user_fk || !resource_fk) {
      return res.status(400).json({ error: 'user_fk and resource_fk are required' });
    }

    const resourceView = await prisma.resourceView.upsert({
      where: {
        user_fk_resource_fk: {
          user_fk,
          resource_fk,
        },
      },
      update: {
        view_count: { increment: 1 },   
        viewed_at: new Date(),         
      },
      create: {
        user_fk,
        resource_fk,
        view_count: 1,
        viewed_at: new Date(),
      },
    });

    res.status(200).json(resourceView);
  } catch (error) {
    console.error('Error recording resource view:', error);
    res.status(500).json({ error: 'Failed to record resource view' });
  }
};

export const getAllResourceViews = async (req: Request, res: Response) => {
  try {
    const all = await prisma.resourceView.findMany({
      include: { user: true, resource: true }
    });
    res.json(all);
  } catch (error) {
    console.error('Error fetching resource views:', error);
    res.status(500).json({ error: 'Failed to fetch resource views' });
  }
};

export const getResourceViewById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const view = await prisma.resourceView.findUnique({
      where: { id },
      include: { user: true, resource: true }
    });

    if (!view) return res.status(404).json({ error: 'ResourceView not found' });

    res.json(view);
  } catch (error) {
    console.error('Error fetching resource view:', error);
    res.status(500).json({ error: 'Failed to fetch resource view' });
  }
};

export const deleteResourceView = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    await prisma.resourceView.delete({ where: { id } });

    res.json({ message: 'ResourceView deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource view:', error);
    res.status(500).json({ error: 'Failed to delete resource view' });
  }
};
