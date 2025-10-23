/**
 * TODO: Set up Clerk authentication and role-based access.
 *
 * - Add middleware to verify Clerk sessions (authenticateToken).
 * - Add middleware to check user roles from the database (requireRole).
 * - These will protect routes so only logged-in users
 *   — and the right roles (admin/parent) — can access them.
 */
import Clerk from '@clerk/express';
import prisma from '../config/prisma';
