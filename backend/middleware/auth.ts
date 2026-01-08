import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma';

/**
 * AUTHENTICATION & AUTHORIZATION TEMPLATE
 * ---------------------------------------
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
      return res.status(401).json({ error: 'No Clerk user ID found' });
    }

    let user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await prisma.user.create({
        data: {
          clerk_id: clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
          role: 'PARENT',
        },
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error syncing user with database:', error);
    res.status(500).json({ error: 'Failed to sync user with database' });
  }
};

export const requireParent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'PARENT' || user.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden: Requires PARENT or ADMIN role',
  });
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({
    error: 'Forbidden: Requires ADMIN role',
  });
};
