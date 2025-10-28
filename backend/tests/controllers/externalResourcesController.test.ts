import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createExternalResources,
  getAllExternalResources,
  getExternalResourcesById,
  updateExternalResources,
  deleteExternalResources,
} from '../../controllers/externalResourcesController';

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

describe('externalResourcesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createExternalResources', () => {
    it('should create external resources successfully', async () => {
      const mockExternalResources = {
        id: 'ckres1234abcd',
        resource_fk: 'mock_resource_fk',
        external_url: 'https://google.com',
      };

      prismaMock.externalResources.create.mockResolvedValue(mockExternalResources as any);

      const req = mockReq({
        body: {
          resource_fk: 'mock_resource_fk',
          external_url: 'https://google.com',
        },
      });
      const res = mockRes();

      await createExternalResources(req, res);

      expect(prismaMock.externalResources.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            resource_fk: 'mock_resource_fk',
            external_url: 'https://google.com',
          },
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'ckres1234abcd' }));
    });

    it('should handle errors during creation', async () => {
      prismaMock.externalResources.create.mockRejectedValue(new Error('Create failed'));

      const req = mockReq({
        body: {
          resource_fk: 'broken_resource_fk',
          external_url: 'https://google.com',
        },
      });
      const res = mockRes();

      await createExternalResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create externalResources' })
      );
    });
  });

  describe('getAllExternalResources', () => {
    it('should return all external resources', async () => {
      prismaMock.externalResources.findMany.mockResolvedValue([
        { id: 'ckres1111', external_url: 'url1' },
        { id: 'ckres2222', external_url: 'url2' },
      ] as any);

      const req = mockReq();
      const res = mockRes();

      await getAllExternalResources(req, res);

      expect(prismaMock.externalResources.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ external_url: 'url1' }),
          expect.objectContaining({ external_url: 'url2' }),
        ])
      );
    });

    it('should handle Prisma errors', async () => {
      prismaMock.externalResources.findMany.mockRejectedValue(new Error('Fetch failed'));
      const req = mockReq();
      const res = mockRes();

      await getAllExternalResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to fetch externalResources' })
      );
    });
  });

  describe('getExternalResourcesById', () => {
    it('should return external resources if found', async () => {
      const mockExternalResources = { id: 'ckres3333', external_url: 'google.com' };
      prismaMock.externalResources.findUnique.mockResolvedValue(mockExternalResources as any);

      const req = mockReq({ params: { id: 'ckres3333' } });
      const res = mockRes();

      await getExternalResourcesById(req, res);

      expect(prismaMock.externalResources.findUnique).toHaveBeenCalledWith({
        where: { id: 'ckres3333' },
        include: { resources: true },
      });
      expect(res.json).toHaveBeenCalledWith(mockExternalResources);
    });

    it('should return 404 if external resources not found', async () => {
      prismaMock.externalResources.findUnique.mockResolvedValue(null);
      const req = mockReq({ params: { id: 'cknotfound' } });
      const res = mockRes();

      await getExternalResourcesById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'externalResources not found' })
      );
    });
  });

  describe('updateExternalResources', () => {
    it('should update external resources successfully', async () => {
      prismaMock.externalResources.update.mockResolvedValue({
        id: 'ckres4444',
        external_url: 'updatedUrl.com',
      } as any);

      const req = mockReq({
        params: { id: 'ckres4444' },
        body: { external_url: 'updatedUrl.com' },
      });
      const res = mockRes();

      await updateExternalResources(req, res);

      expect(prismaMock.externalResources.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'ckres4444' },
          data: expect.objectContaining({ external_url: 'updatedUrl.com' }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ external_url: 'updatedUrl.com' })
      );
    });

    it('should handle errors during update', async () => {
      prismaMock.externalResources.update.mockRejectedValue(new Error('Update failed'));

      const req = mockReq({ params: { id: 'ckfail9999' }, body: { external_url: 'Broken' } });
      const res = mockRes();

      await updateExternalResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to update externalResources' })
      );
    });
  });

  describe('deleteExternalResources', () => {
    it('should delete a resource successfully', async () => {
      prismaMock.externalResources.delete.mockResolvedValue({ id: 'ckres5555' } as any);

      const req = mockReq({ params: { id: 'ckres5555' } });
      const res = mockRes();

      await deleteExternalResources(req, res);

      expect(prismaMock.externalResources.delete).toHaveBeenCalledWith({
        where: { id: 'ckres5555' },
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/deleted/i) })
      );
    });

    it('should handle errors during delete', async () => {
      prismaMock.externalResources.delete.mockRejectedValue(new Error('Delete failed'));
      const req = mockReq({ params: { id: 'ckbroken1234' } });
      const res = mockRes();

      await deleteExternalResources(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete externalResources' })
      );
    });
  });
});
