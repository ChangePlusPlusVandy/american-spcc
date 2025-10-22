import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { CATEGORY_TYPE } from '@prisma/client';

export const createLabel = async (req: Request, res: Response) => {
  try {
    const { label_name, category } = req.body;

    if (!label_name || !category) {
      return res.status(400).json({ error: 'Missing label_name or category' });
    }

    if (!Object.values(CATEGORY_TYPE).includes(category)) {
      return res.status(400).json({ error: 'Invalid category type' });
    }

    const newLabel = await prisma.categoryLabel.create({
      data: { label_name, category },
    });

    res.status(201).json(newLabel);
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
};

export const getAllLabels = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where = category ? { category: category as CATEGORY_TYPE } : undefined;

    const labels = await prisma.categoryLabel.findMany({
      where,
      orderBy: { label_name: 'asc' },
    });

    res.json(labels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
};

export const getLabelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const label = await prisma.categoryLabel.findUnique({
      where: { id },
      include: { resources: true },
    });

    if (!label) return res.status(404).json({ error: 'Label not found' });
    res.json(label);
  } catch (error) {
    console.error('Error fetching label:', error);
    res.status(500).json({ error: 'Failed to fetch label' });
  }
};

export const updateLabel = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { label_name, category } = req.body;

    const updated = await prisma.categoryLabel.update({
      where: { id },
      data: { label_name, category },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating label:', error);
    res.status(500).json({ error: 'Failed to update label' });
  }
};

export const deleteLabel = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.categoryLabel.delete({ where: { id } });
    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Error deleting label:', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
};
