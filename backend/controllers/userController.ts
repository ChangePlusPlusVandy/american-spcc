import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from '../config/prisma';
import { RELATIONSHIP_TYPE, HOUSEHOLD_TYPE } from '@prisma/client';

// sync user
export const syncUser = async (req: Request, res: Response) => {
  console.log('syncUser HIT');

  try {
    const userId = (req as any).auth?.userId;
    console.log('userId:', userId);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    console.log('clerk user fetched');

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;

    console.log('attempting prisma upsert', {
      clerk_id: userId,
      email,
    });

    const user = await prisma.user.upsert({
      where: { clerk_id: userId },
      update: {},
      create: {
        clerk_id: userId,
        email,
        first_name: clerkUser.firstName ?? null,
        last_name: clerkUser.lastName ?? null,
        role: 'PARENT',
      },
    });

    console.log('DB user synced:', user.id);

    return res.json({ ok: true });
  } catch (err) {
    console.error('syncUser FAILED:', err);
    return res.status(500).json({ error: 'sync failed' });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const clerk_id = req.params.clerkId as string;
    const user = await prisma.user.findUnique({ where: { clerk_id } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by Clerk ID:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;

    const {
      first_name,
      last_name,
      email,
      role,
      relationship,
      household_type,
      topics_of_interest,
      kids_age_groups,
      subscribed_newsletter,
    } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        first_name: first_name ?? undefined,
        last_name: last_name ?? undefined,
        email: email ?? undefined,
        role: role ?? undefined,
        relationship: relationship ?? undefined,
        household_type: household_type ?? undefined,
        topics_of_interest: topics_of_interest ?? undefined,
        kids_age_groups: kids_age_groups ?? undefined,
        subscribed_newsletter: subscribed_newsletter ?? undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id as string;
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    console.log('PATCH /api/users/me HIT');

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      relationship,
      household_type,
      topics_of_interest,
      kids_age_groups,
      subscribed_newsletter,
      onboarding_complete,
    } = req.body;

    const data: any = {};

    if (relationship !== undefined) {
      data.relationship =
        relationship && relationship !== ''
          ? (relationship as RELATIONSHIP_TYPE)
          : null;
    }

    if (household_type !== undefined) {
      data.household_type =
        household_type && household_type !== ''
          ? (household_type as HOUSEHOLD_TYPE)
          : null;
    }

    if (Array.isArray(topics_of_interest)) {
      data.topics_of_interest = topics_of_interest;
    }

    if (Array.isArray(kids_age_groups)) {
      data.kids_age_groups = kids_age_groups;
    }

    if (typeof subscribed_newsletter === 'boolean') {
      data.subscribed_newsletter = subscribed_newsletter;
    }

    if (typeof onboarding_complete === 'boolean') {
      data.onboarding_complete = onboarding_complete;
    }

    const updatedUser = await prisma.user.update({
      where: { clerk_id: userId },
      data,
    });

    return res.json(updatedUser);
  } catch (err) {
    console.error('updateCurrentUser error:', err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};