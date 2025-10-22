import { CATEGORY_TYPE } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createLabel,
  getAllLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
} from '../../controllers/categoryLabelController';

const mockReq = (overrides: any = {}): any => ({
  body: {},
  query: {},
  params: {},
  ...overrides,
});

const mockRes = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('CategoryLabelController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createLabel', () => {
    it('should create a label successfully', async () => {
      const newLabel = {
        id: 1,
        label_name: 'Positive Discipline',
        category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
      };

      prismaMock.categoryLabel.create.mockResolvedValue(newLabel as any);

      const req = mockReq({
        body: {
          label_name: 'Positive Discipline',
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        },
      });
      const res = mockRes();

      await createLabel(req, res);

      expect(prismaMock.categoryLabel.create).toHaveBeenCalledWith({
        data: {
          label_name: 'Positive Discipline',
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('should return 400 if category is invalid', async () => {
      const req = mockReq({ body: { label_name: 'Test Label', category: 'INVALID' } });
      const res = mockRes();

      await createLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
      expect(prismaMock.categoryLabel.create).not.toHaveBeenCalled();
    });

    it('should handle Prisma errors gracefully', async () => {
      prismaMock.categoryLabel.create.mockRejectedValue(new Error('Database error'));

      const req = mockReq({
        body: { label_name: 'Error Label', category: CATEGORY_TYPE.EDUCATION_LEARNING },
      });
      const res = mockRes();

      await createLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create label' })
      );
    });
  });

  describe('getAllLabels', () => {
    it('should return all labels', async () => {
      const labels = [
        {
          id: 1,
          label_name: 'Co-Parenting',
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        },
        {
          id: 2,
          label_name: 'Positive Discipline',
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        },
      ];

      prismaMock.categoryLabel.findMany.mockResolvedValue(labels as any);

      const req = mockReq();
      const res = mockRes();

      await getAllLabels(req, res);

      expect(prismaMock.categoryLabel.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(labels));
    });

    it('should filter labels by category when query param provided', async () => {
      prismaMock.categoryLabel.findMany.mockResolvedValue([
        { id: 3, label_name: 'Child Safety', category: CATEGORY_TYPE.SAFETY_PROTECTION },
      ] as any);

      const req = mockReq({ query: { category: CATEGORY_TYPE.SAFETY_PROTECTION } });
      const res = mockRes();

      await getAllLabels(req, res);

      expect(prismaMock.categoryLabel.findMany).toHaveBeenCalledWith({
        where: { category: CATEGORY_TYPE.SAFETY_PROTECTION },
        orderBy: { label_name: 'asc' },
      });
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getLabelById', () => {
    it('should return a label if found', async () => {
      const label = {
        id: 1,
        label_name: 'Co-Parenting',
        category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
      };
      prismaMock.categoryLabel.findUnique.mockResolvedValue(label as any);

      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      await getLabelById(req, res);

      expect(prismaMock.categoryLabel.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { resources: true },
      });
      expect(res.json).toHaveBeenCalledWith(label);
    });

    it('should return 404 if label not found', async () => {
      prismaMock.categoryLabel.findUnique.mockResolvedValue(null);

      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      await getLabelById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Label not found' }));
    });
  });

  describe('updateLabel', () => {
    it('should update a label successfully', async () => {
      const updated = {
        id: 1,
        label_name: 'Updated Label',
        category: CATEGORY_TYPE.HEALTH_WELLBEING,
      };

      prismaMock.categoryLabel.update.mockResolvedValue(updated as any);

      const req = mockReq({
        params: { id: 1 },
        body: { label_name: 'Updated Label', category: CATEGORY_TYPE.HEALTH_WELLBEING },
      });
      const res = mockRes();

      await updateLabel(req, res);

      expect(prismaMock.categoryLabel.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { label_name: 'Updated Label', category: CATEGORY_TYPE.HEALTH_WELLBEING },
      });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should handle errors during update', async () => {
      prismaMock.categoryLabel.update.mockRejectedValue(new Error('Update failed'));

      const req = mockReq({ params: { id: 1 }, body: { label_name: 'Broken' } });
      const res = mockRes();

      await updateLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to update label' })
      );
    });
  });

  describe('deleteLabel', () => {
    it('should delete a label successfully', async () => {
      prismaMock.categoryLabel.delete.mockResolvedValue({ id: 1 } as any);

      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      await deleteLabel(req, res);

      expect(prismaMock.categoryLabel.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });

    it('should handle delete errors', async () => {
      prismaMock.categoryLabel.delete.mockRejectedValue(new Error('Delete failed'));

      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      await deleteLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete label' })
      );
    });
  });
});
