import { Response, NextFunction } from 'express';
import { ClerkExpressWithAuth, clerkClient } from '@clerk/clerk-sdk-node';
import type { WithAuthProp } from '@clerk/clerk-sdk-node';
import type { Request } from 'express';
import prisma from '../config/prisma';

/**
 * AUTHENTICATION & AUTHORIZATION TEMPLATE
 * ---------------------------------------
 * Roles: PARENT, ADMIN
 * Responsibilities:
 *  1. Verify Clerk authentication
 *  2. Sync user with database (if needed)
 *  3. Enforce role-based access control
 */

export const authenticateUser = (req: WithAuthProp<Request>, res: Response, next: NextFunction) => {
  ClerkExpressWithAuth({})(req as any, res as any, async () => {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ error: 'Unauthorized: No valid session' });
    }
    next();
  });
};

export const syncUserWithDB = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  try {
    // STEP 1: Get Clerk user ID (maps to `clerk_id` in DB)
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ error: 'No Clerk user ID found' });
    }

    // STEP 2: Look up user in `users` table by clerk_id (via Prisma)
    let user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
    });

    // If not found, fetch from Clerk and create a new user (default role: "PARENT")
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await prisma.user.create({
        data: {
          clerk_id: clerkId,
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          role: 'PARENT',
        },
      });
    }

    // STEP 3: Attach user record to req for role-based middleware
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return res.status(500).json({ error: 'Failed to sync user with database' });
  }
};

export const requireParent = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'PARENT' || user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Requires PARENT or ADMIN role' });
  }
};

export const requireAdmin = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  if (user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Requires ADMIN role' });
  }
};
