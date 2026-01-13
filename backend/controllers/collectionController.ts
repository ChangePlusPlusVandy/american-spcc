import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import prisma from '../config/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';



async function getOrCreateParent(clerkId: string) {
  const clerkUser = await clerkClient.users.getUser(clerkId);

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    throw new Error('Clerk user has no email address');
  }

  return prisma.parent.upsert({
    where: { clerk_id: clerkId },
    update: {},
    create: {
      clerk_id: clerkId,
      email,
      first_name: clerkUser.firstName ?? null,
      last_name: clerkUser.lastName ?? null,
    },
  });
}


/* ============================
   Create Collection
============================ */
export const createCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }

    const parent = await getOrCreateParent(clerkId);


    const collection = await prisma.collection.create({
      data: {
        parent_fk: parent.id,
        name,
      },
    });

    res.status(201).json(collection);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'A collection with this name already exists.' });
    }

    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

/* ============================
   Get Collections for Current Parent
============================ */
export const getCollectionsByUser = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const parent = await getOrCreateParent(clerkId);


    const collections = await prisma.collection.findMany({
      where: { parent_fk: parent.id },
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: {
            resource: {
              select: {
                id: true,
                title: true,
                externalResources: {
                  select: { external_url: true },
                },
              },
            },
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

/* ============================
   Get Collection by ID
============================ */
export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const parent = await getOrCreateParent(clerkId);


    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          include: { resource: true },
        },
      },
    });

    if (!parent || !collection || collection.parent_fk !== parent.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
};

/* ============================
   Rename Collection
============================ */
export const renameCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'New name is required.' });

    const parent = await getOrCreateParent(clerkId);


    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!parent || !collection || collection.parent_fk !== parent.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: { name },
    });

    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'A collection with this name already exists.' });
    }

    console.error('Error renaming collection:', error);
    res.status(500).json({ error: 'Failed to rename collection' });
  }
};

/* ============================
   Delete Collection
============================ */
export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const parent = await getOrCreateParent(clerkId);


    const collection = await prisma.collection.findUnique({
      where: { id },
    });

    if (!parent || !collection || collection.parent_fk !== parent.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.collection.delete({ where: { id } });

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
};

/* ============================
   Add Resource to Collection
============================ */
export const addResourceToCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { collectionId } = req.params;
    const { resource_fk } = req.body;
    if (!resource_fk) {
      return res.status(400).json({ error: 'resource_fk is required' });
    }

    const parent = await getOrCreateParent(clerkId);


    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!parent || !collection || collection.parent_fk !== parent.id) {
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
      return res
        .status(409)
        .json({ error: 'Resource already exists in this collection.' });
    }

    console.error('Error adding resource to collection:', error);
    res.status(500).json({ error: 'Failed to add resource to collection' });
  }
};

/* ============================
   Remove Resource from Collection
============================ */
export const removeResourceFromCollection = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId } = req.params;

    const parent = await getOrCreateParent(clerkId);


    const item = await prisma.collectionItem.findUnique({
      where: { id: itemId },
      include: { collection: true },
    });

    if (!parent || !item || item.collection.parent_fk !== parent.id) {
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
