import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import prisma from '../config/prisma';

export const getAdminMe = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { clerk_id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_active: true,
        created_at: true,
      },
    });

    if (!admin) {
      return res.status(403).json({ error: 'Not an admin' });
    }

    return res.json({
      ...admin,
      full_name: [admin.first_name, admin.last_name].filter(Boolean).join(' '),
    });
  } catch (err) {
    console.error('getAdminMe failed:', err);
    return res.status(500).json({ error: 'Failed to fetch admin profile' });
  }
};
