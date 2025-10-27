import { CATEGORY_TYPE, RESOURCE_TYPE, HOSTING_TYPE, AGE_GROUP, LANGUAGE } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createInternalHostedResource,
  getAllInternalHostedResources,
  getInternalHostedResourceById,
  updateInternalHostedResource,
  deleteInternalHostedResource,
} from '../../controllers/internalHostedResourceController';

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

describe('InternalHostedResourceController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createInternalHostedResource', () => {
    it('should create an internally hosted resource successfully with labels', async () => {
      const mockInternalHostedResource = {
        id: 'ckres1234abcd',
        title: 'Guide to Positive Discipline',
        resource_type: RESOURCE_TYPE.PDF,
        hosting_type: HOSTING_TYPE.INTERNAL,
        category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
        age_group: AGE_GROUP.AGE_4_7,
        language: LANGUAGE.ENGLISH,
        time_to_read: 10,
        labels: [{ label: { id: 'cklbl5678efgh', label_name: 'Co-Parenting' } }],
      };

      prismaMock.internalhostedresource.create.mockResolvedValue(mockInternalHostedResource as any);

      const req = mockReq({
        body: {
          title: 'Guide to Positive Discipline',
          resource_type: RESOURCE_TYPE.PDF,
          hosting_type: HOSTING_TYPE.INTERNAL,
          category: CATEGORY_TYPE.PARENTING_SKILLS_RELATIONSHIPS,
          age_group: AGE_GROUP.AGE_4_7,
          language: LANGUAGE.ENGLISH,
          time_to_read: 10,
          label_ids: ['cklbl5678efgh'],
        },
      });
      const res = mockRes();

      await createInternalHostedResource(req, res);

      expect(prismaMock.internalhostedresource.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Guide to Positive Discipline',
            labels: expect.objectContaining({
              create: expect.arrayContaining([
                expect.objectContaining({ label: { connect: { id: 'cklbl5678efgh' } } }),
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
      prismaMock.internalhostedresource.create.mockRejectedValue(new Error('Create failed'));

      const req = mockReq({
        body: {
          title: 'Broken Internal Hosted Resource',
          resource_type: RESOURCE_TYPE.PDF,
          hosting_type: HOSTING_TYPE.INTERNAL,
          category: CATEGORY_TYPE.HEALTH_WELLBEING,
        },
      });
      const res = mockRes();

      await createInternalHostedResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create resource' })
      );
    });
  });

  describe('getAllInternalHostedResources', () => {
    it('should return all internal hosted resources', async () => {
      prismaMock.internalhostedresource.findMany.mockResolvedValue([
        { id: 'ckres1111', title: 'Guide 1' },
        { id: 'ckres2222', title: 'Guide 2' },
      ] as any);

      const req = mockReq();
      const res = mockRes();

      await getAllInternalHostedResources(req, res);

      expect(prismaMock.internalhostedresource.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'Guide 1' })])
      );
    });

    it('should filter internal hosted resources by category', async () => {
      prismaMock.internalhostedresource.findMany.mockResolvedValue([
        { id: 'cksafety1234', title: 'Safety Guide' },
      ] as any);

      const req = mockReq({ query: { category: CATEGORY_TYPE.SAFETY_PROTECTION } });
      const res = mockRes();

      await getAllInternalHostedResources(req, res);

      expect(prismaMock.internalhostedresource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { category: CATEGORY_TYPE.SAFETY_PROTECTION } })
      );
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle Prisma errors', async () => {
      prismaMock.internalhostedresource.findMany.mockRejectedValue(new Error('Fetch failed'));
      const req = mockReq();
      const res = mockRes();

      await getAllInternalHostedResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to fetch internal hosted resources' })
      );
    });
  });

  describe('getInternalHostedResourceById', () => {
    it('should return a internal hosted resource if found', async () => {
      const mockResource = { id: 'ckres3333', title: 'Parenting 101' };
      prismaMock.internalhostedresource.findUnique.mockResolvedValue(mockResource as any);

      const req = mockReq({ params: { id: 'ckres3333' } });
      const res = mockRes();

      await getInternalHostedResourceById(req, res);

      expect(prismaMock.internalhostedresource.findUnique).toHaveBeenCalledWith({
        where: { id: 'ckres3333' },
        include: { labels: { include: { label: true } } },
      });
      expect(res.json).toHaveBeenCalledWith(mockResource);
    });

    it('should return 404 if internal hosted resource not found', async () => {
      prismaMock.internalhostedresource.findUnique.mockResolvedValue(null);
      const req = mockReq({ params: { id: 'cknotfound' } });
      const res = mockRes();

      await getInternalHostedResourceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Internal Hosted Resource not found' })
      );
    });
  });

  describe('updateInternalHostedResource', () => {
    it('should update a internal hosted resource successfully', async () => {
      prismaMock.internalhostedresource.update.mockResolvedValue({
        id: 'ckres4444',
        title: 'Updated Title',
      } as any);

      const req = mockReq({
        params: { id: 'ckres4444' },
        body: { title: 'Updated Title' },
      });
      const res = mockRes();

      await updateInternalHostedResource(req, res);

      expect(prismaMock.internalhostedresource.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ckres4444' },
          data: expect.objectContaining({ title: 'Updated Title' }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated Title' }));
    });

    it('should handle errors during update', async () => {
      prismaMock.internalhostedresource.update.mockRejectedValue(new Error('Update failed'));

      const req = mockReq({ params: { id: 'ckfail9999' }, body: { title: 'Broken' } });
      const res = mockRes();

      await updateInternalHostedResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to update internal hosted resource' })
      );
    });
  });

  describe('deleteInternalHostedResource', () => {
    it('should delete a internal hosted resource successfully', async () => {
      prismaMock.internalhostedresource.delete.mockResolvedValue({ id: 'ckres5555' } as any);

      const req = mockReq({ params: { id: 'ckres5555' } });
      const res = mockRes();

      await deleteInternalHostedResource(req, res);

      expect(prismaMock.internalhostedresource.delete).toHaveBeenCalledWith({
        where: { id: 'ckres5555' },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });

    it('should handle errors during delete', async () => {
      prismaMock.internalhostedresource.delete.mockRejectedValue(new Error('Delete failed'));
      const req = mockReq({ params: { id: 'ckbroken1234' } });
      const res = mockRes();

      await deleteInternalHostedResource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete internal hosted resource' })
      );
    });
  });
});
