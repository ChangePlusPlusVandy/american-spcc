/*import { Request, Response } from 'express';

export const recordResourceView = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const { user_fk, resource_fk } = req.body;

    if (!user_fk || !resource_fk) {
      return res.status(400).json({ error: 'user_fk and resource_fk are required' });
    }

    const existingView = await prisma.resourceView.findUnique({
      where: {
        user_fk_resource_fk: {
          user_fk,
          resource_fk,
        },
      },
    });

    const resourceView = existingView
      ? await prisma.resourceView.update({
          where: { id: existingView.id },
          data: {
            view_count: existingView.view_count + 1,
            viewed_at: new Date(),
          },
        })
      : await prisma.resourceView.create({
          data: {
            user_fk,
            resource_fk,
            view_count: 1,
            viewed_at: new Date(),
          },
        });

    res.status(200).json(resourceView);
  } catch (error) {
    console.error('Error recording resource view:', error);
    res.status(500).json({ error: 'Failed to record resource view' });
  }
};

export const getAllResourceViews = async (_req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const all = await prisma.resourceView.findMany();
    res.json(all);
  } catch (error) {
    console.error('Error fetching resource views:', error);
    res.status(500).json({ error: 'Failed to fetch resource views' });
  }
};

export const getResourceViewById = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id;

    const view = await prisma.resourceView.findUnique({
      where: { id },
    });

    if (!view) return res.status(404).json({ error: 'ResourceView not found' });

    res.json(view);
  } catch (error) {
    console.error('Error fetching resource view:', error);
    res.status(500).json({ error: 'Failed to fetch resource view' });
  }
};

export const deleteResourceView = async (req: Request, res: Response) => {
  try {
    const { prisma } = await import('../config/prisma');
    const id = req.params.id;

    await prisma.resourceView.delete({ where: { id } });

    res.json({ message: 'ResourceView deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource view:', error);
    res.status(500).json({ error: 'Failed to delete resource view' });
  }
};*/
