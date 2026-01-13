import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from '../config/prisma';
import { RELATIONSHIP_TYPE, HOUSEHOLD_TYPE } from '@prisma/client';

// sync user
export const syncUser = async (req: Request, res: Response) => {
  console.log('syncUser HIT');

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    const parent = await prisma.parent.upsert({
      where: { clerk_id: userId },
      update: {},
      create: {
        clerk_id: userId,
        email,
        first_name: clerkUser.firstName ?? null,
        last_name: clerkUser.lastName ?? null,
      },
    });

    console.log('Parent synced:', parent.id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('syncUser FAILED:', err);
    return res.status(500).json({ error: 'sync failed' });
  }
};


// Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const parents = await prisma.parent.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(parents);
  } catch (error) {
    console.error('Error fetching parents:', error);
    res.status(500).json({ error: 'Failed to fetch parents' });
  }
};


// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const parent = await prisma.parent.findUnique({ where: { id } });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    res.json(parent);
  } catch (error) {
    console.error('Error fetching parent:', error);
    res.status(500).json({ error: 'Failed to fetch parent' });
  }
};


// Get user by Clerk ID
export const getUserByClerkId = async (req: Request, res: Response) => {
  try {
    const clerk_id = req.params.clerkId;

    // Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(clerk_id);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: 'User has no email' });
    }

    const parent = await prisma.parent.upsert({
      where: { clerk_id },
      update: {},
      create: {
        clerk_id,
        email,
        first_name: clerkUser.firstName ?? null,
        last_name: clerkUser.lastName ?? null,
      },
    });

    res.json(parent);
  } catch (error) {
    console.error('Error fetching parent by Clerk ID:', error);
    res.status(500).json({ error: 'Failed to fetch parent' });
  }
};


// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const {
      first_name,
      last_name,
      email,
      relationship,
      household_type,
      topics_of_interest,
      kids_age_groups,
      subscribed_newsletter,
    } = req.body;

    const updated = await prisma.parent.update({
      where: { id },
      data: {
        first_name: first_name ?? undefined,
        last_name: last_name ?? undefined,
        email: email ?? undefined,
        relationship: relationship ?? undefined,
        household_type: household_type ?? undefined,
        topics_of_interest: topics_of_interest ?? undefined,
        kids_age_groups: kids_age_groups ?? undefined,
        subscribed_newsletter: subscribed_newsletter ?? undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating parent:', error);
    res.status(500).json({ error: 'Failed to update parent' });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.parent.delete({ where: { id } });

    res.json({ message: 'Parent deleted successfully' });
  } catch (error) {
    console.error('Error deleting parent:', error);
    res.status(500).json({ error: 'Failed to delete parent' });
  }
};



export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      first_name,
      last_name,
      relationship,
      household_type,
      topics_of_interest,
      kids_age_groups,
      subscribed_newsletter,
      onboarding_complete,
    } = req.body;

    const data: any = {};

    if (first_name !== undefined) data.first_name = first_name || null;
    if (last_name !== undefined) data.last_name = last_name || null;

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

    const updatedParent = await prisma.parent.upsert({
      where: { clerk_id: userId },
      update: data,
      create: {
        clerk_id: userId,
        ...data,
      },
    });
    
    return res.json(updatedParent);
    
  } catch (err) {
    console.error('updateCurrentUser error:', err);
    return res.status(500).json({ error: 'Failed to update parent' });
  }
};
