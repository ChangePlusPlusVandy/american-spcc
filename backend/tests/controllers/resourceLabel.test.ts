import { CATEGORY_TYPE } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createResourceLabel,
  getAllResourceLabels,
  getResourceLabelById,
  updateResourceLabel,
  deleteResourceLabel,
} from '../../controllers/resourceLabelController';

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

describe('ResourceLabelController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createLabel', () => {
    it('should create a label successfully', async () => {
      const newLabel = {
        id: 'cktest1234abcd',
        resource_id: 'cktest2345abcd',
        label_id: 'cktest3456abcd',
      };

      prismaMock.resourceLabel.create.mockResolvedValue(newLabel as any);

      const req = mockReq({
        body: {
          resource_id: 'cktest2345abcd',
          label_id: 'cktest3456abcd',
        },
      });
      const res = mockRes();

      await createResourceLabel(req, res);

      expect(prismaMock.categoryLabel.create).toHaveBeenCalledWith({
        data: {
          resource_id: 'cktest2345abcd',
          label_id: 'cktest3456abcd',
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'cktest1234abcd' }));
    });

    it('should handle Prisma errors gracefully', async () => {
      prismaMock.categoryLabel.create.mockRejectedValue(new Error('Database error'));

      const req = mockReq({
        body: { resource_id: 'cktest2345abcd', label_id: 'cktest3456abcd' },
      });
      const res = mockRes();

      await createResourceLabel(req, res);

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
          id: 'cktest1111',
          resource_id: 'cktest2345abcd',
          label_id: 'cktest3456abcd',
        },
        {
          id: 'cktest2222',
          resource_id: 'cktest3333abcd',
          label_id: 'cktest3333abcd',
        },
      ];

      prismaMock.categoryLabel.findMany.mockResolvedValue(labels as any);

      const req = mockReq();
      const res = mockRes();

      await getAllResourceLabels(req, res);

      expect(prismaMock.categoryLabel.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(labels));
    });

    it('should filter labels by category when query param provided', async () => {
      prismaMock.resourceLabel.findMany.mockResolvedValue([
        { id: 'cktest3333', resource_id: 'cktest4444', label_id: 'cktest5555' },
      ] as any);

      const req = mockReq({ query: { resource_id: 'cktest4444' } });
      const res = mockRes();

      await getAllResourceLabels(req, res);

      expect(prismaMock.categoryLabel.findMany).toHaveBeenCalledWith({
        where: { resource_id: 'cktest4444' },
      });
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getResourceLabelById', () => {
    it('should return a label if found', async () => {
      const label = {
        id: 'cktest4444',
        resource_id: 'cktest7777',
        label_id: 'cktest5555',
      };
      prismaMock.categoryLabel.findUnique.mockResolvedValue(label as any);

      const req = mockReq({ params: { id: 'cktest4444' } });
      const res = mockRes();

      await getResourceLabelById(req, res);

      expect(prismaMock.categoryLabel.findUnique).toHaveBeenCalledWith({
        where: { id: 'cktest4444' },
        include: { resource: true },
      });
      expect(res.json).toHaveBeenCalledWith(label);
    });

    it('should return 404 if label not found', async () => {
      prismaMock.categoryLabel.findUnique.mockResolvedValue(null);

      const req = mockReq({ params: { id: 'cknotfound' } });
      const res = mockRes();

      await getResourceLabelById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Label not found' }));
    });
  });

  describe('updateLabel', () => {
    it('should update a label successfully', async () => {
      const updated = {
        id: 'cktest5555',
        resource_id: 'cktestUpdate',
        label_id: 'newLabelId',
      };

      prismaMock.categoryLabel.update.mockResolvedValue(updated as any);

      const req = mockReq({
        params: { id: 'cktest5555' },
        body: { resource_id: 'cktestUpdate', label_id: 'newLabelId' },
      });
      const res = mockRes();

      await updateResourceLabel(req, res);

      expect(prismaMock.categoryLabel.update).toHaveBeenCalledWith({
        where: { id: 'cktest5555' },
        data: { resource_id: 'cktestUpdate', label_id: 'newLabelId' },
      });
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should handle errors during update', async () => {
      prismaMock.categoryLabel.update.mockRejectedValue(new Error('Update failed'));

      const req = mockReq({ params: { id: 'ckfail9999' }, body: { label_id: 'Broken' } });
      const res = mockRes();

      await updateResourceLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to update label' })
      );
    });
  });

  describe('deleteLabel', () => {
    it('should delete a label successfully', async () => {
      prismaMock.categoryLabel.delete.mockResolvedValue({ id: 'cktest6666' } as any);

      const req = mockReq({ params: { id: 'cktest6666' } });
      const res = mockRes();

      await deleteResourceLabel(req, res);

      expect(prismaMock.categoryLabel.delete).toHaveBeenCalledWith({ where: { id: 'cktest6666' } });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });

    it('should handle delete errors', async () => {
      prismaMock.categoryLabel.delete.mockRejectedValue(new Error('Delete failed'));

      const req = mockReq({ params: { id: 'ckbroken1234' } });
      const res = mockRes();

      await deleteResourceLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete label' })
      );
    });
  });
});
