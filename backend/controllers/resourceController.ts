import { Request, Response } from 'express';
import prisma from '../config/prisma';

/**
 * CREATE a new resource
 */
export const createResource = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      resource_type,
      hosting_type,
      category_type,
      label_id,
      age_range_min,
      age_range_max,
      time_to_read,
    } = req.body;

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        resource_type,
        hosting_type,
        category_type,
        label_id,
        age_range_min: Number(age_range_min),
        age_range_max: Number(age_range_max),
        time_to_read: Number(time_to_read),
      },
      include: { label: true },
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

/**
 * READ all resources
 */
export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      include: { label: true },
      orderBy: { created_at: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

/**
 * READ a single resource by ID
 */
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const resource = await prisma.resource.findUnique({
      where: { resource_id: id },
      include: { label: true },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

/**
 * UPDATE a resource
 */
export const updateResource = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      description,
      resource_type,
      hosting_type,
      category_type,
      label_id,
      age_range_min,
      age_range_max,
      time_to_read,
    } = req.body;

    const resource = await prisma.resource.update({
      where: { resource_id: id },
      data: {
        title,
        description,
        resource_type,
        hosting_type,
        category_type,
        label_id,
        age_range_min: Number(age_range_min),
        age_range_max: Number(age_range_max),
        time_to_read: Number(time_to_read),
      },
      include: { label: true },
    });

    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

/**
 * DELETE a resource
 */
export const deleteResource = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.resource.delete({ where: { resource_id: id } });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};
