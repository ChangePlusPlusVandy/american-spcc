import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { getAuth } from '@clerk/express';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  const firstName = clerkUser.firstName || undefined;
  const lastName = clerkUser.lastName || undefined;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? undefined;

  const user = await prisma.user.upsert({
    where: { clerk_id: userId },
    update: {
      // only set names if DB doesn't already have them
      first_name: firstName,
      last_name: lastName,
    },
    create: {
      clerk_id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'PARENT',
    },
  });

  res.json(user);
};
// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
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

    const updatedUser = await prisma.user.update({
      where: { clerk_id: userId },
      data: {
        relationship,
        household_type,
        topics_of_interest,
        kids_age_groups,
        subscribed_newsletter,
        onboarding_complete,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error('updateCurrentUser error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
