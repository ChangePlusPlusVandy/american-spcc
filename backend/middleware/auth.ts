import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma';

/**
 * AUTHENTICATION & AUTHORIZATION
 * Roles: PARENT, ADMIN
 */

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

export const syncParentWithDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: 'No Clerk user ID found' });
    }

    let parent = await prisma.parent.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!parent) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email =
        clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        return res.status(400).json({ error: 'Clerk user has no email' });
      }

      parent = await prisma.parent.create({
        data: {
          clerk_id: clerkId,
          email,
        },
      });
    }

    (req as any).parent = parent;
    next();
  } catch (error) {
    console.error('Error syncing parent with database:', error);
    res.status(500).json({ error: 'Failed to sync parent with database' });
  }
};

export const requireParent = (req: Request, res: Response, next: NextFunction) => {
  const parent = (req as any).parent;

  if (!parent) {
    return res.status(401).json({ error: 'Parent not found' });
  }

  next();
};
