import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createInternalHostedResource = async (req: Request, res: Response) => {
  try {
    const {
      resource_fk,
      s3_key
    } = req.body;

    const internalHostedResources = await prisma.internalHostedResources.create({
      data: {
        resource_fk,
        s3_key
      }
    });

    res.status(201).json(internalHostedResources);
  } catch (error) {
    console.error('Error creating internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to create internal hosted resource' });
  }
};

export const getAllInternalHostedResources = async (req: Request, res: Response) => {
  try {
    const allInternalResources = await prisma.internalHostedResources.findMany();
    res.json(allInternalResources);
  } catch (error) {
    console.error('Error fetching internal hosted resources:', error);
    res.status(500).json({ error: 'Failed to fetch internal hosted resources' });
  }
};

export const getInternalHostedResourceById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const internalHostedResource = await prisma.internalHostedResources.findUnique({
      where: { id },
      include: { resources: true },
    });

    if (!internalHostedResource) return res.status(404).json({ error: 'Internal Hosted Resource not found' });
    res.json(internalHostedResource);
  } catch (error) {
    console.error('Error fetching internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to fetch internal hosted resource' });
  }
};

export const updateInternalHostedResource = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const {
      resource_fk,
      s3_key
    } = req.body;

    const updated = await prisma.internalHostedResources.update({
      where: { id },
      data: {
        resource_fk,
        s3_key
      }
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
    await prisma.internalHostedResources.delete({ where: { id } });
    res.json({ message: 'Internal Hosted Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting internal hosted resource:', error);
    res.status(500).json({ error: 'Failed to delete internal hosted resource' });
  }
};
