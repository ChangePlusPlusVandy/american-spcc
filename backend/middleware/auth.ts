import { Request, Response, NextFunction } from 'express';
import { Parent, AdminUser } from '@prisma/client';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../config/prisma';

type AuthedRequest = Request & {
  parent?: Parent;
  admin?: AdminUser;
};

/**
 * AUTHENTICATION & AUTHORIZATION
 */

// ✅ This one is fine with plain Request
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

// ✅ MUST use AuthedRequest
export const syncParentWithDB = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) return res.status(401).json({ error: 'Unauthorized' });

    let parent = await prisma.parent.findUnique({
      where: { clerk_id: clerkId },
    });

    if (!parent) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        return res.status(400).json({ error: 'User has no email' });
      }

      parent = await prisma.parent.create({
        data: {
          clerk_id: clerkId,
          email,
        },
      });
    }

    req.parent = parent; // ✅ now typed
    next();
  } catch (err) {
    console.error('syncParentWithDB failed:', err);
    return res.status(500).json({ error: 'Auth sync failed' });
  }
};

// ✅ MUST use AuthedRequest
export const requireParent = (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.parent) {
    return res.status(403).json({ error: 'Parent access required' });
  }
  next();
};

// ✅ async + AuthedRequest + no duplicate variable
export const requireAdmin = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const admin = await prisma.adminUser.findUnique({
    where: { clerk_id: userId },
  });

  if (!admin || !admin.is_active) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.admin = admin; // ✅ typed
  next();
};
