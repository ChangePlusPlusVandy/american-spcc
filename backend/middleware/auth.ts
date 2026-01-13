import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma';

/**
 * AUTHENTICATION & AUTHORIZATION
 * Roles: PARENT, ADMIN
 */

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

export const syncUserWithDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let parent = await prisma.parent.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!parent) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const email =
        clerkUser.emailAddresses.find(
          (e) => e.id === clerkUser.primaryEmailAddressId
        )?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress ??
        '';

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
    res.status(500).json({ error: 'Failed to sync user with database' });
  }
};

export const requireParent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parent = (req as any).parent;

  if (!parent) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (parent.role === 'PARENT' || parent.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parent = (req as any).parent;

  if (!parent) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (parent.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
};
