import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createResourceView = async (req: Request, res: Response) => {
  try {
    const { user_fk, resource_fk, viewed_at, view_count } = req.body;

    const resourceView = await prisma.resourceView.create({
      data: {
        user_fk,
        resource_fk,
        viewed_at,
        view_count,
      },
    });

    res.status(201).json(resourceView);
  } catch (error) {
    console.error('Error creating resource view:', error);
    res.status(500).json({ error: 'Failed to create resource view' });
  }
};

export const getAllResourceViews = async (req: Request, res: Response) => {
  try {
    const allResourceViews = await prisma.resourceView.findMany();
    res.json(allResourceViews);
  } catch (error) {
    console.error('Error fetching resources view:', error);
    res.status(500).json({ error: 'Failed to fetch resourceView' });
  }
};

export const getResourceViewById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const resourceViews = await prisma.resourceView.findUnique({
      where: { id },
    });

    if (!resourceViews) return res.status(404).json({ error: 'resourceView not found' });
    res.json(resourceViews);
  } catch (error) {
    console.error('Error fetching resource views:', error);
    res.status(500).json({ error: 'Failed to fetch resource views' });
  }
};

export const updateResourceView = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { user_fk, resource_fk, viewed_at, view_count } = req.body;

    const updated = await prisma.resourceView.update({
      where: { id },
      data: { user_fk, resource_fk, viewed_at, view_count },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating resource views:', error);
    res.status(500).json({ error: 'Failed to update resource views' });
  }
};

export const deleteResourceView = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.resourceView.delete({ where: { id } });
    res.json({ message: 'ResourceView deleted successfully' });
  } catch (error) {
    console.error('Error deleting resourceView:', error);
    res.status(500).json({ error: 'Failed to delete resourceView' });
  }
};
