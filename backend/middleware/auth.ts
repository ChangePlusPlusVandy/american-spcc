import { Response, NextFunction } from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import type { WithAuthProp } from '@clerk/clerk-sdk-node';
import type { Request } from 'express';

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
  // TODO: Implement Clerk session validation
  ClerkExpressWithAuth({})(req as any, res as any, async () => {
    // Call next() if session is valid; else return 401
    next();
  });
};

export const syncUserWithDB = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  // STEP 1: Get Clerk user ID (maps to `clerk_id` in DB)
  const clerkId = req.auth?.userId;

  // STEP 2: Look up user in `users` table by clerk_id (via Prisma)
  // If not found, fetch from Clerk and create a new user (default role: "PARENT")
  // DB fields: id, clerk_id, first_name, last_name, email, role, timestamps

  // STEP 3: Attach user record to req for role-based middleware
  next();
};

export const requireParent = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  // TODO: Allow PARENT or ADMIN
  next();
};

export const requireAdmin = async (
  req: WithAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  // TODO: Allow only ADMIN
  next();
};
