import { CATEGORY_TYPE } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import { createLabel, getLabels, deleteLabel } from '../../controllers/categoryLabelController'; // ✅ Capitalized to match filename

// ✅ Mock Express req/res helpers
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
    it('creates a label successfully', async () => {
      prismaMock.categoryLabel.create.mockResolvedValue({
        id: 1,
        label_name: 'Positive Discipline',
        category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS, // ✅ fixed enum
      } as any);

      const req = mockReq({
        body: {
          label_name: 'Positive Discipline',
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS, // ✅ fixed enum
        },
      });
      const res = mockRes();

      await createLabel(req, res);

      expect(prismaMock.categoryLabel.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ label_name: 'Positive Discipline' })
      );
    });

    it('returns 400 for invalid category', async () => {
      const req = mockReq({
        body: { label_name: 'Test', category: 'INVALID' },
      });
      const res = mockRes();

      await createLabel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });

  describe('getLabels', () => {
    it('returns all labels', async () => {
      prismaMock.categoryLabel.findMany.mockResolvedValue([
        { id: 1, label_name: 'Co-Parenting' },
        { id: 2, label_name: 'Positive Discipline' },
      ] as any);

      const req = mockReq();
      const res = mockRes();

      await getLabels(req, res);

      expect(prismaMock.categoryLabel.findMany).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ label_name: 'Co-Parenting' })])
      );
    });
  });

  describe('deleteLabel', () => {
    it('deletes a label successfully', async () => {
      prismaMock.categoryLabel.delete.mockResolvedValue({ id: 1 } as any);

      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      await deleteLabel(req, res);

      expect(prismaMock.categoryLabel.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });
  });
});
