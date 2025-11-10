import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import { createAdminLog, getAllAdminLogs } from '../../controllers/adminLogsController';

const mockReq = (overrides: any = {}): any => ({
  body: {},
  params: {},
  query: {},
  ...overrides,
});

const mockRes = (): any => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminLogsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createAdminLog', () => {
    it('should create an admin log successfully', async () => {
      const mockAdmin = { id: 'admin123', role: 'ADMIN' };
      const mockLog = {
        id: 'log1',
        admin_fk: 'admin123',
        action: 'DELETE_USER',
        details: 'Removed user A',
        created_at: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockAdmin as any);
      prismaMock.adminLog.create.mockResolvedValue(mockLog as any);

      const req = mockReq({
        body: { admin_id: 'admin123', action: 'DELETE_USER', details: 'Removed user A' },
      });
      const res = mockRes();

      await createAdminLog(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 'admin123' } });
      expect(prismaMock.adminLog.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockLog);
    });

    it('should return 400 if missing fields', async () => {
      const req = mockReq({ body: { admin_id: null } });
      const res = mockRes();

      await createAdminLog(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });

    it('should return 404 if admin not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = mockReq({ body: { admin_id: 'bad', action: 'DELETE_USER' } });
      const res = mockRes();

      await createAdminLog(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Admin not found or invalid role' })
      );
    });

    it('should handle Prisma errors gracefully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'admin123', role: 'ADMIN' } as any);
      prismaMock.adminLog.create.mockRejectedValue(new Error('DB error'));

      const req = mockReq({ body: { admin_id: 'admin123', action: 'DELETE_USER' } });
      const res = mockRes();

      await createAdminLog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create admin log' })
      );
    });
  });

  describe('getAllAdminLogs', () => {
    it('should fetch all logs successfully', async () => {
      const mockLogs = [{ id: '1', admin_fk: 'admin123', action: 'TEST', created_at: new Date() }];
      prismaMock.adminLog.findMany.mockResolvedValue(mockLogs as any);

      const req = mockReq();
      const res = mockRes();

      await getAllAdminLogs(req, res);

      expect(prismaMock.adminLog.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLogs);
    });

    it('should handle Prisma errors gracefully', async () => {
      prismaMock.adminLog.findMany.mockRejectedValue(new Error('DB error'));
      const res = mockRes();

      await getAllAdminLogs({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to fetch admin logs' })
      );
    });
  });
});
