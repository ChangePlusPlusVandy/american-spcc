import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createInternalHostedResource = async (req: Request, res: Response) => {
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

    const resource = await prisma.internalhostedresource.create({
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
    console.error('Error creating internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to create internal hosted resource' });
  }
};

export const getAllInternalHostedResources = async (req: Request, res: Response) => {
  try {
    const { category, label_id } = req.query;
    const where: any = {};
    if (category) where.category = category;
    if (label_id) where.labels = { some: { label_id: label_id as string } };

    const resources = await prisma.internalhostedresource.findMany({
      where,
      include: {
        labels: { include: { label: true } },
      },
      orderBy: { updated_at: 'desc' },
    });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching internal hosted resources:', error);
    res.status(500).json({ error: 'Failed to fetch internal hosted resources' });
  }
};

export const getInternalHostedResourceById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const resource = await prisma.internalhostedresource.findUnique({
      where: { id },
      include: { labels: { include: { label: true } } },
    });
    if (!resource) return res.status(404).json({ error: 'Internal Hosted Resource not found' });
    res.json(resource);
  } catch (error) {
    console.error('Error fetching internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to fetch internal hosted resource' });
  }
};

export const updateInternalHostedResource = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
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

    const updated = await prisma.internalhostedresource.update({
      where: { id },
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
    console.error('Error updating internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to update internal hosted resource' });
  }
};

export const deleteInternalHostedResource = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.internalhostedresource.delete({ where: { id } });
    res.json({ message: 'Internal Hosted Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to delete internal hosted resource' });
  }
};
