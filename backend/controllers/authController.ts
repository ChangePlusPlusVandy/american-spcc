import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import prisma from '../config/prisma';

export const getMe = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { clerk_id: userId },
  });

  if (admin) {
    return res.json({ role: 'ADMIN', admin });
  }

  const parent = await prisma.parent.findUnique({
    where: { clerk_id: userId },
  });

  if (parent) {
    return res.json({ role: 'PARENT', parent });
  }

  return res.status(404).json({ error: 'User not found in database' });
};
