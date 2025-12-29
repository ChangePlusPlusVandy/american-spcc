import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import prisma from '../config/prisma';

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const collection = await prisma.collection.create({
      data: {
        user_fk: user.id,
        name,
      },
    });

    res.status(201).json(collection);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A collection with this name already exists.' });
    }

    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

export const getCollectionsByUser = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const collections = await prisma.collection.findMany({
      where: { user_fk: user.id },
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          select: { resource_fk: true },
        },
      },
    });

    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { id } = req.params;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          include: { resource: true },
        },
      },
    });

    if (!user || !collection || collection.user_fk !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
};

export const renameCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { id } = req.params;
    const { name } = req.body;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });
    if (!name) return res.status(400).json({ error: 'New name is required.' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!user || !collection || collection.user_fk !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: { name },
    });

    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A collection with this name already exists.' });
    }

    console.error('Error renaming collection:', error);
    res.status(500).json({ error: 'Failed to rename collection' });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { id } = req.params;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!user || !collection || collection.user_fk !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.collection.delete({ where: { id } });

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
};

export const addResourceToCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { collectionId } = req.params;
    const { resource_fk } = req.body;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });
    if (!resource_fk) return res.status(400).json({ error: 'resource_fk is required' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!user || !collection || collection.user_fk !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const item = await prisma.collectionItem.create({
      data: {
        collection_fk: collectionId,
        resource_fk,
      },
    });

    res.status(201).json(item);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Resource already exists in this collection.' });
    }

    console.error('Error adding resource to collection:', error);
    res.status(500).json({ error: 'Failed to add resource to collection' });
  }
};

export const removeResourceFromCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    const { itemId } = req.params;

    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    const item = await prisma.collectionItem.findUnique({
      where: { id: itemId },
      include: {
        collection: true,
      },
    });

    if (!user || !item || item.collection.user_fk !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.collectionItem.delete({
      where: { id: itemId },
    });

    res.json({ message: 'Resource removed from collection' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};
