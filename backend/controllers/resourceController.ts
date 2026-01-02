import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from '../config/s3';

const getSignedImageUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  });
};

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

    if (category) {
      where.category = category;
    }

    if (label_id) {
      where.labels = {
        some: { label_id: label_id as string },
      };
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        labels: { include: { label: true } },
        externalResources: true,
      },
    });

    // Attach signed S3 image URLs (if present)
    const resourcesWithImages = await Promise.all(
      resources.map(async (resource) => {
        let imageUrl: string | null = null;

        if (resource.image_s3_key) {
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: resource.image_s3_key,
          });

          imageUrl = await getSignedUrl(s3, command, {
            expiresIn: 60 * 5, // 5 minutes
          });
        }

        return {
          ...resource,
          imageUrl,
        };
      })
    );

    res.json(resourcesWithImages);
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
    const query = (req.query.q as string)?.trim();
    if (!query) return res.json([]);

    const tokens = query.toLowerCase().split(/\s+/);

    const resources = await prisma.resource.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        hosting_type: true,
        externalResources: {
          select: { external_url: true },
        },
      },
    });

    const results = resources
      .map((r) => {
        let score = 0;

        for (const token of tokens) {
          if (r.title) {
            const count =
              r.title.toLowerCase().split(token).length - 1;
            score += count * 3;
          }
          if (r.category) {
            const count =
              r.category.toLowerCase().split(token).length - 1;
            score += count * 2;
          }
          if (r.description) {
            const count =
              r.description.toLowerCase().split(token).length - 1;
            score += count * 1;
          }
        }

        return { ...r, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 10)
      .map(({ score, ...rest }) => rest);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};
