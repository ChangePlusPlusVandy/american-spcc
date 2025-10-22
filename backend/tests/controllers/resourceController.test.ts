import { CATEGORY_TYPE, RESOURCE_TYPE, HOSTING_TYPE, AGE_GROUP, LANGUAGE } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createResource,
  getAllResources,
  getResourceById,
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
    it('should create a resource successfully with labels', async () => {
      const mockResource = {
        resource_id: 1,
        title: 'Guide to Positive Discipline',
        resource_type: RESOURCE_TYPE.PDF,
        hosting_type: HOSTING_TYPE.INTERNAL,
        category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        age_group: AGE_GROUP.AGE_4_7,
        language: LANGUAGE.ENGLISH,
        time_to_read: 10,
        labels: [{ label: { id: 2, label_name: 'Co-Parenting' } }],
      };

      prismaMock.resource.create.mockResolvedValue(mockResource as any);

      const req = mockReq({
        body: {
          title: 'Guide to Positive Discipline',
          resource_type: RESOURCE_TYPE.PDF,
          hosting_type: HOSTING_TYPE.INTERNAL,
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
          age_group: AGE_GROUP.AGE_4_7,
          language: LANGUAGE.ENGLISH,
          time_to_read: 10,
          label_ids: [2],
        },
      });
      const res = mockRes();

      await createResource(req, res);

      expect(prismaMock.resource.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Guide to Positive Discipline',
            labels: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({ label: { connect: { id: 2 } } }),
              ]),
            }),
          }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Guide to Positive Discipline' })
      );
    });

    it('should handle errors during creation', async () => {
      prismaMock.resource.create.mockRejectedValue(new Error('Create failed'));

      const req = mockReq({
        body: {
          title: 'Broken Resource',
          resource_type: RESOURCE_TYPE.PDF,
          hosting_type: HOSTING_TYPE.INTERNAL,
          category: CATEGORY_TYPE.HEALTH_WELLBEING,
        },
      });
      const res = mockRes();

      await createResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create resource' })
      );
    });
  });

  describe('getAllResources', () => {
    it('should return all resources', async () => {
      prismaMock.resource.findMany.mockResolvedValue([
        { resource_id: 1, title: 'Guide 1' },
        { resource_id: 2, title: 'Guide 2' },
      ] as any);

      const req = mockReq();
      const res = mockRes();

      await getAllResources(req, res);

      expect(prismaMock.resource.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'Guide 1' })])
      );
    });

    it('should filter resources by category', async () => {
      prismaMock.resource.findMany.mockResolvedValue([
        { resource_id: 5, title: 'Safety Guide' },
      ] as any);

      const req = mockReq({ query: { category: CATEGORY_TYPE.SAFETY_PROTECTION } });
      const res = mockRes();

      await getAllResources(req, res);

      expect(prismaMock.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { category: CATEGORY_TYPE.SAFETY_PROTECTION } })
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle Prisma errors', async () => {
      prismaMock.resource.findMany.mockRejectedValue(new Error('Fetch failed'));
      const req = mockReq();
      const res = mockRes();

      await getAllResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to fetch resources' })
      );
    });
  });

  describe('getResourceById', () => {
    it('should return a resource if found', async () => {
      const mockResource = { resource_id: 1, title: 'Parenting 101' };
      prismaMock.resource.findUnique.mockResolvedValue(mockResource as any);

      const req = mockReq({ params: { id: 1 } });
      const res = mockRes();

      await getResourceById(req, res);

      expect(prismaMock.resource.findUnique).toHaveBeenCalledWith({
        where: { resource_id: 1 },
        include: { labels: { include: { label: true } } },
      });
      expect(res.json).toHaveBeenCalledWith(mockResource);
    });

    it('should return 404 if resource not found', async () => {
      prismaMock.resource.findUnique.mockResolvedValue(null);
      const req = mockReq({ params: { id: 999 } });
      const res = mockRes();

      await getResourceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Resource not found' })
      );
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
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

      expect(prismaMock.resource.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { resource_id: 1 },
          data: expect.objectContaining({ title: 'Updated Title' }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title' }));
    });

    it('should handle errors during update', async () => {
      prismaMock.resource.update.mockRejectedValue(new Error('Update failed'));

      const req = mockReq({ params: { id: '1' }, body: { title: 'Broken' } });
      const res = mockRes();

      await updateResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to update resource' })
      );
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      prismaMock.resource.delete.mockResolvedValue({ resource_id: 1 } as any);

      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      await deleteResource(req, res);

      expect(prismaMock.resource.delete).toHaveBeenCalledWith({ where: { resource_id: 1 } });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });

    it('should handle errors during delete', async () => {
      prismaMock.resource.delete.mockRejectedValue(new Error('Delete failed'));
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();

      await deleteResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete resource' })
      );
    });
  });
});
