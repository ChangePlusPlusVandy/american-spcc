import { Request, Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';

/**
 * AUTHENTICATION & AUTHORIZATION TEMPLATE
 * ---------------------------------------
 * Roles: PARENT, ADMIN
 * Responsibilities:
 *  1. Verify Clerk authentication
 *  2. Sync user with database (if needed)
 *  3. Enforce role-based access control
 */
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  ClerkExpressWithAuth({})(req as any, res as any, () => {
    if (!(req as any).auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
};

export const syncUserWithDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = (req as any).auth?.userId;
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
    return res.status(500).json({ error: 'Failed to sync user with database' });
  }
};

export const requireParent = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'PARENT' || user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({
      error: 'Forbidden: Requires PARENT or ADMIN role',
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({
      error: 'Forbidden: Requires ADMIN role',
    });
  }
};
