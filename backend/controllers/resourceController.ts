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
      age_groups,
      language,
      time_to_read,
      label_ids,
    } = req.body;

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description ?? null,
        resource_type,
        hosting_type,
        category,
        age_groups: age_groups ?? [],
        language,
        time_to_read,
        labels: label_ids
          ? {
              create: label_ids.map((labelId: string) => ({
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
    if (label_id)
      where.labels = {
        some: { label_id: label_id as string },
      };

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
    const id = req.params.id;
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        labels: { include: { label: true } },
        collectionItems: true,
        resourceViews: true,
      },
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
    const id = req.params.id;

    const {
      title,
      description,
      resource_type,
      hosting_type,
      category,
      age_groups,
      language,
      time_to_read,
      label_ids,
    } = req.body;

    const updated = await prisma.resource.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        resource_type: resource_type ?? undefined,
        hosting_type: hosting_type ?? undefined,
        category: category ?? undefined,
        age_groups: age_groups ?? undefined,
        language: language ?? undefined,
        time_to_read: time_to_read ?? undefined,
        ...(label_ids && {
          labels: {
            deleteMany: {}, 
            create: label_ids.map((labelId: string) => ({
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
    const id = req.params.id;

    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

export const searchResources = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim() === '') {
      return res.json([]);
    }

    const resources = await prisma.resource.findMany({
      where: {
        labels: {
          some: {
            label: {
              label_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
      take: 10,
    });

    res.json(resources);
  } catch (error) {
    console.error('Error searching resources:', error);
    res.status(500).json({ error: 'Failed to search resources' });
  }
};
