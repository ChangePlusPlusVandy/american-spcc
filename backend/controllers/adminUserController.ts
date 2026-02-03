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

export const updateAdminMe = async (req: Request, res: Response) => {
  try {
    console.log('PATCH /api/admins/me HIT');

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { first_name, last_name, is_active } = req.body;

    const data: any = {};

    if (first_name !== undefined) data.first_name = first_name || null;
    if (last_name !== undefined) data.last_name = last_name || null;
    if (typeof is_active === 'boolean') data.is_active = is_active;

    const updatedAdmin = await prisma.adminUser.update({
      where: { clerk_id: userId },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        is_active: true,
        created_at: true,
      },
    });

    return res.json({
      ...updatedAdmin,
      full_name: [updatedAdmin.first_name, updatedAdmin.last_name].filter(Boolean).join(' '),
    });
  } catch (err) {
    console.error('updateAdminMe failed:', err);
    return res.status(500).json({ error: 'Failed to update admin profile' });
  }
};
