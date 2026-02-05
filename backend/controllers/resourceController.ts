import { Request, Response } from 'express';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3 } from '../config/s3';
import { CATEGORY_TYPE } from '@prisma/client';

const getSignedImageUrl = async (key: string) => {
  const s3 = getS3();
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });
};

export const createResource = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const {
      title,
      description,
      resource_type,
      hosting_type,
      category,
      age_groups,
      language,
      time_to_read,
      external_url,
      image_s3_key,
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
        image_s3_key: image_s3_key ?? undefined,
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

    if (typeof external_url !== 'undefined' && external_url) {
      await prisma.externalResources.create({
        data: { resource_fk: resource.id, external_url },
      });
    }

    if (typeof image_s3_key !== 'undefined' && image_s3_key) {
      await prisma.internalHostedResources.create({
        data: { resource_fk: resource.id, s3_key: image_s3_key },
      });
    }

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

export const getAllResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const { category, label_id } = req.query;
    const where: any = {};

    if (
      typeof category === 'string' &&
      Object.values(CATEGORY_TYPE).includes(category as CATEGORY_TYPE)
    ) {
      where.category = category as CATEGORY_TYPE;
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

    const resourcesWithImages = await Promise.all(
      resources.map(async (resource) => {
        let imageUrl: string | null = null;

        if (resource.image_s3_key) {
          const s3 = getS3();
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
    const { prisma } = await import('../config/prisma');
    const id = req.params.id;
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        labels: { include: { label: true } },
        collectionItems: true,
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
    const { prisma } = await import('../config/prisma');
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
      external_url,
      image_s3_key,
      label_ids,
    } = req.body;

    await prisma.externalResources.deleteMany({ where: { resource_fk: id } });
    if (external_url !== '' && external_url !== null) {
      await prisma.externalResources.create({
        data: { resource_fk: id, external_url },
      });
    }

    // Upsert internal hosted resource
    if (image_s3_key) {
      await prisma.internalHostedResources.upsert({
        where: { resource_fk: id },
        update: { s3_key: image_s3_key },
        create: { resource_fk: id, s3_key: image_s3_key },
      });
    }

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
        image_s3_key: image_s3_key ?? undefined,
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
    const { prisma } = await import('../config/prisma');
    const id = req.params.id;

    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};

// Featured "Getting Started" resource titles (stakeholder-recommended)
const FEATURED_RESOURCE_TITLES = [
  'Take the ACEs Quiz',
  'Positive Childhood Experiences',
  'What Is Positive Parenting?',
  'What Is Positive Discipline?',
  'Coregulation',
  'Take the PCEs Quiz',
];

export const getFeaturedResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');

    // Fetch the 6 stakeholder-recommended resources by title
    const resources = await prisma.resource.findMany({
      where: {
        title: {
          in: FEATURED_RESOURCE_TITLES,
        },
      },
      include: {
        labels: { include: { label: true } },
        externalResources: true,
      },
    });

    // Add signed image URLs
    const resourcesWithImages = await Promise.all(
      resources.map(async (resource) => {
        let imageUrl: string | null = null;

        if (resource.image_s3_key) {
          imageUrl = await getSignedImageUrl(resource.image_s3_key);
        }

        // check if the imageURL is not null here
        if (imageUrl == null) {
          throw new Error('No image URL in s3 bukcet for the provided image key');
        }

        return {
          ...resource,
          imageUrl,
        };
      })
    );

    // Sort resources to match the order in FEATURED_RESOURCE_TITLES
    const sortedResources = resourcesWithImages.sort((a, b) => {
      const aIndex = FEATURED_RESOURCE_TITLES.indexOf(a.title);
      const bIndex = FEATURED_RESOURCE_TITLES.indexOf(b.title);
      return aIndex - bIndex;
    });

    res.json(sortedResources);
  } catch (error) {
    console.error('Error fetching featured resources:', error);
    res.status(500).json({ error: 'Failed to fetch featured resources' });
  }
};

export const searchResources = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
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
        image_s3_key: true,
        externalResources: {
          select: { external_url: true },
        },
      },
    });

    const scored = resources
      .map((r) => {
        let score = 0;

        for (const token of tokens) {
          if (r.title) score += (r.title.toLowerCase().split(token).length - 1) * 3;
          if (r.category) score += (r.category.toLowerCase().split(token).length - 1) * 2;
          if (r.description) score += r.description.toLowerCase().split(token).length - 1;
        }

        return { ...r, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const withImages = await Promise.all(
      scored.map(async ({ score, image_s3_key, ...rest }) => ({
        ...rest,
        imageUrl: image_s3_key
          ? await (() => {
              const s3 = getS3();
              return getSignedUrl(
                s3,
                new GetObjectCommand({
                  Bucket: process.env.S3_BUCKET_NAME!,
                  Key: image_s3_key,
                }),
                { expiresIn: 60 * 5 }
              );
            })()
          : null,
      }))
    );

    res.json(withImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};
