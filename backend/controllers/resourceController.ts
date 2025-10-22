import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createResource = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      resource_type,
      hosting_type,
      category,
      age_group,
      language,
      time_to_read,
      label_ids,
    } = req.body;

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        resource_type,
        hosting_type,
        category,
        age_group,
        language,
        time_to_read,
        labels: label_ids
          ? {
              create: label_ids.map((labelId: number) => ({
                label: { connect: { id: labelId } },
              })),
            }
          : undefined,
      },
      include: {
        labels: { include: { label: true } },
      },
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { category, label_id } = req.query;
    const where: any = {};
    if (category) where.category = category;
    if (label_id) where.labels = { some: { label_id: Number(label_id) } };
    const resources = await prisma.resource.findMany({
      where,
      include: {
        labels: { include: { label: true } },
      },
      orderBy: { updated_at: 'desc' },
    });
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const resource = await prisma.resource.findUnique({
      where: { resource_id: id },
      include: { labels: { include: { label: true } } },
    });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      description,
      resource_type,
      hosting_type,
      category,
      age_group,
      language,
      time_to_read,
      label_ids,
    } = req.body;

    const updated = await prisma.resource.update({
      where: { resource_id: id },
      data: {
        title,
        description,
        resource_type,
        hosting_type,
        category,
        age_group,
        language,
        time_to_read,
        ...(label_ids && {
          labels: {
            deleteMany: {},
            create: label_ids.map((labelId: number) => ({
              label: { connect: { id: labelId } },
            })),
          },
        }),
      },
      include: { labels: { include: { label: true } } },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

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
