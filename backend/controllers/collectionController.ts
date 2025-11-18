import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { user_fk, name } = req.body;

    if (!user_fk || !name) {
      return res.status(400).json({ error: 'user_fk and name are required.' });
    }

    const collection = await prisma.collection.create({
      data: { user_fk, name },
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
    const user_fk = req.params.userId;

    const collections = await prisma.collection.findMany({
      where: { user_fk },
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: {
            resource: true,
          },
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
    const id = req.params.id;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          include: { resource: true },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
};


export const renameCollection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: 'New name is required.' });

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
    const id = req.params.id;

    await prisma.collection.delete({
      where: { id },
    });

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
};

export const addResourceToCollection = async (req: Request, res: Response) => {
  try {
    const collection_fk = req.params.collectionId;
    const { resource_fk } = req.body;

    if (!resource_fk) {
      return res.status(400).json({ error: 'resource_fk is required' });
    }

    const item = await prisma.collectionItem.create({
      data: {
        collection_fk,
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
    const itemId = req.params.itemId;

    await prisma.collectionItem.delete({
      where: { id: itemId },
    });

    res.json({ message: 'Resource removed from collection' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

