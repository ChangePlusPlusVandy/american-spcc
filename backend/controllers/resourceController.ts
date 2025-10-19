import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/resources
 * Fetch all resources
 */
export const getResources = async (_req: Request, res: Response): Promise<void> => {
  try {
    const resources = await prisma.resources.findMany();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

/**
 * GET /api/resources/:id
 * Fetch a single resource by ID
 */
export const getResourceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const resource = await prisma.resources.findUnique({ where: { id } });

    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

/**
 * POST /api/resources
 * Create a new resource
 */
export const createResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const newResource = await prisma.resources.create({ data: req.body });
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

/**
 * PUT /api/resources/:id
 * Update a resource by ID
 */
export const updateResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.resources.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Prisma "record not found" error
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

/**
 * DELETE /api/resources/:id
 * Delete a resource by ID
 */
export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await prisma.resources.delete({ where: { id } });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};
