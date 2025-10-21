import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { CATEGORY_TYPE } from '@prisma/client';

/**
 * CREATE a new label under a specific category
 */
export const createLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { label_name, category } = req.body;

    // Validate category
    if (!Object.values(CATEGORY_TYPE).includes(category)) {
      res.status(400).json({ error: 'Invalid category type.' });
      return;
    }

    const label = await prisma.categoryLabel.create({
      data: {
        label_name,
        category,
      },
    });

    res.status(201).json(label);
  } catch (error) {
    console.error('❌ Error creating label:', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
};

/**
 * GET all labels (optionally filtered by category)
 * Example: /api/labels?category=CHILD_DEVELOPMENT
 */
export const getLabels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;

    const filters =
      category && Object.values(CATEGORY_TYPE).includes(category as CATEGORY_TYPE)
        ? { category: category as CATEGORY_TYPE }
        : undefined;

    const labels = await prisma.categoryLabel.findMany({
      where: filters,
      orderBy: { label_name: 'asc' },
    });

    res.json(labels);
  } catch (error) {
    console.error('❌ Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
};

/**
 * DELETE a label by ID
 */
export const deleteLabel = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid label ID.' });
      return;
    }

    await prisma.categoryLabel.delete({ where: { id } });
    res.json({ message: '✅ Label deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting label:', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
};
