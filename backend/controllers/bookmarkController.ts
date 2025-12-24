/*import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createBookmark = async (req: Request, res: Response) => {
  try {
    const clerkId = (req as any).auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { resource_id } = req.body;

    if (!resource_id) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookmark = await prisma.bookmarks.create({
      data: {
        user_fk: user.id,
        resource_fk: resource_id,
      },
      include: {
        resource: true,
      },
    });

    res.status(201).json(bookmark);
  } catch (error: unknown) {
    console.error('Error creating bookmark:', error);

    if (typeof error === 'object' && error !== null && 'code' in error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Bookmark already exists' });
      }

      if (error.code === 'P2003') {
        return res.status(404).json({ error: 'Resource not found' });
      }
    }

    return res.status(500).json({ error: 'Failed to create bookmark' });
  }
};

export const removeBookmark = async (req: Request, res: Response) => {
  try {
    const clerkId = (req as any).auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { resource_id } = req.body;

    if (!resource_id) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.bookmarks.delete({
      where: {
        user_fk_resource_fk: {
          user_fk: user.id,
          resource_fk: resource_id,
        },
      },
    });

    res.status(204).send();
  } catch (error: unknown) {
    console.error('Error removing bookmark:', error);

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    return res.status(500).json({ error: 'Failed to delete bookmark' });
  }
};

export const getBookmarks = async (req: Request, res: Response) => {
  try {
    const clerkId = (req as any).auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        user_fk: user.id,
      },
      include: {
        resource: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const resources = bookmarks.map((bookmark) => bookmark.resource);

    res.status(200).json(resources);
  } catch (error: unknown) {
    console.error('Error fetching bookmarks:', error);
    return res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
};

export const checkBookmarkStatus = async (req: Request, res: Response) => {
  try {
    const clerkId = (req as any).auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { resource_id } = req.body;

    if (!resource_id) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const bookmark = await prisma.bookmarks.findUnique({
      where: {
        user_fk_resource_fk: {
          user_fk: user.id,
          resource_fk: resource_id,
        },
      },
    });

    if (bookmark) {
      res.status(200).json({ bookmarked: true });
    } else {
      res.status(200).json({ bookmarked: false });
    }
  } catch (error: unknown) {
    console.error('Error checking bookmark status:', error);
    return res.status(500).json({ error: 'Failed to check bookmark' });
  }
};
*/
