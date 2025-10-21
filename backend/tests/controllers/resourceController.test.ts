import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} from '../../controllers/resourceController';

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

describe('ResourceController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createResource', () => {
    it('creates a resource successfully', async () => {
      prismaMock.resource.create.mockResolvedValue({
        resource_id: 1,
        title: 'Guide to Positive Discipline',
      } as any);

      const req = mockReq({
        body: {
          title: 'Guide to Positive Discipline',
          resource_type: 'PDF',
          hosting_type: 'AWS',
          category_type: 'PARENTING_SKILLS_AND_RELATIONSHIPS',
          age_range_min: 5,
          age_range_max: 12,
          time_to_read: 10,
        },
      });
      const res = mockRes();

      await createResource(req, res);

      expect(prismaMock.resource.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Guide to Positive Discipline' })
      );
    });
  });

  describe('getResources', () => {
    it('fetches all resources', async () => {
      prismaMock.resource.findMany.mockResolvedValue([{ resource_id: 1, title: 'Guide 1' }] as any);

      const req = mockReq();
      const res = mockRes();

      await getResources(req, res);

      expect(prismaMock.resource.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'Guide 1' })])
      );
    });
  });

  describe('updateResource', () => {
    it('updates a resource successfully', async () => {
      prismaMock.resource.update.mockResolvedValue({
        resource_id: 1,
        title: 'Updated Title',
      } as any);

      const req = mockReq({
        params: { id: '1' },
        body: { title: 'Updated Title' },
      });
      const res = mockRes();

      await updateResource(req, res);

      expect(prismaMock.resource.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title' }));
    });
  });

  describe('deleteResource', () => {
    it('deletes a resource successfully', async () => {
      prismaMock.resource.delete.mockResolvedValue({ resource_id: 1 } as any);

      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      await deleteResource(req, res);

      expect(prismaMock.resource.delete).toHaveBeenCalledWith({
        where: { resource_id: 1 },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });
  });
});
