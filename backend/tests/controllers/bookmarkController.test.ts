import { mockReset } from 'jest-mock-extended';
import { prismaMock } from '../setup/prismaMock.setup';
import {
  createBookmark,
  removeBookmark,
  getBookmarks,
  checkBookmarkStatus,
} from '../../controllers/bookmarkController';

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

describe('bookmarkController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
  });

  describe('createBookmark', () => {
    it('should create a bookmark successfully', async () => {
      const mockUser = {
        id: 'user123',
        clerk_id: 'clerk_user123',
        first_name: 'John',
        last_name: 'Doe',
      };

      const mockBookmark = {
        id: 'bookmark123',
        user_fk: 'user123',
        resource_fk: 'resource456',
        created_at: new Date(),
        resource: {
          id: 'resource456',
          title: 'Parenting Guide',
          resource_type: 'PDF',
        },
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.create.mockResolvedValue(mockBookmark as any);

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await createBookmark(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_user123' },
      });
      expect(prismaMock.bookmarks.create).toHaveBeenCalledWith({
        data: {
          user_fk: 'user123',
          resource_fk: 'resource456',
        },
        include: {
          resource: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBookmark);
    });

    it('should return 401 when unauthorized', async () => {
      const req = mockReq({
        auth: {},
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await createBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = mockReq({
        auth: { userId: 'clerk_nonexistent' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await createBookmark(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_nonexistent' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(prismaMock.bookmarks.create).not.toHaveBeenCalled();
    });

    it('should handle errors during creation', async () => {
      const mockUser = { id: 'user123', clerk_id: 'clerk_user123' };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.create.mockRejectedValue(new Error('Create failed'));

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await createBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to create bookmark' })
      );
    });
  });

  describe('removeBookmark', () => {
    it('should remove a bookmark successfully', async () => {
      const mockUser = {
        id: 'user123',
        clerk_id: 'clerk_user123',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.delete.mockResolvedValue({} as any);

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();
      res.send = jest.fn().mockReturnValue(res);

      await removeBookmark(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_user123' },
      });
      expect(prismaMock.bookmarks.delete).toHaveBeenCalledWith({
        where: {
          user_fk_resource_fk: {
            user_fk: 'user123',
            resource_fk: 'resource456',
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 401 when unauthorized', async () => {
      const req = mockReq({
        auth: {},
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = mockReq({
        auth: { userId: 'clerk_nonexistent' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await removeBookmark(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_nonexistent' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(prismaMock.bookmarks.delete).not.toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
      const mockUser = { id: 'user123', clerk_id: 'clerk_user123' };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.delete.mockRejectedValue(new Error('Delete failed'));

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await removeBookmark(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to delete bookmark' })
      );
    });
  });

  describe('getBookmarks', () => {
    it('should return all bookmarked resources', async () => {
      const mockUser = {
        id: 'user123',
        clerk_id: 'clerk_user123',
      };

      const mockBookmarks = [
        {
          id: 'bookmark1',
          user_fk: 'user123',
          resource_fk: 'resource456',
          created_at: new Date('2024-01-02'),
          resource: {
            id: 'resource456',
            title: 'Parenting Guide',
            resource_type: 'PDF',
          },
        },
        {
          id: 'bookmark2',
          user_fk: 'user123',
          resource_fk: 'resource789',
          created_at: new Date('2024-01-01'),
          resource: {
            id: 'resource789',
            title: 'Health Guide',
            resource_type: 'VIDEO',
          },
        },
      ];

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.findMany.mockResolvedValue(mockBookmarks as any);

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
      });
      const res = mockRes();

      await getBookmarks(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_user123' },
      });
      expect(prismaMock.bookmarks.findMany).toHaveBeenCalledWith({
        where: {
          user_fk: 'user123',
        },
        include: {
          resource: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockBookmarks[0].resource, mockBookmarks[1].resource]);
    });

    it('should return 401 when unauthorized', async () => {
      const req = mockReq({
        auth: {},
      });
      const res = mockRes();

      await getBookmarks(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = mockReq({
        auth: { userId: 'clerk_nonexistent' },
      });
      const res = mockRes();

      await getBookmarks(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_nonexistent' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(prismaMock.bookmarks.findMany).not.toHaveBeenCalled();
    });

    it('should handle Prisma errors', async () => {
      const mockUser = { id: 'user123', clerk_id: 'clerk_user123' };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.findMany.mockRejectedValue(new Error('Fetch failed'));

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
      });
      const res = mockRes();

      await getBookmarks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to fetch bookmarks' })
      );
    });
  });

  describe('checkBookmarkStatus', () => {
    it('should return bookmarked: true when bookmark exists', async () => {
      const mockUser = {
        id: 'user123',
        clerk_id: 'clerk_user123',
      };

      const mockBookmark = {
        id: 'bookmark123',
        user_fk: 'user123',
        resource_fk: 'resource456',
        created_at: new Date(),
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.findUnique.mockResolvedValue(mockBookmark as any);

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await checkBookmarkStatus(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_user123' },
      });
      expect(prismaMock.bookmarks.findUnique).toHaveBeenCalledWith({
        where: {
          user_fk_resource_fk: {
            user_fk: 'user123',
            resource_fk: 'resource456',
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ bookmarked: true });
    });

    it('should return bookmarked: false when bookmark doesnt exist', async () => {
      const mockUser = {
        id: 'user123',
        clerk_id: 'clerk_user123',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.findUnique.mockResolvedValue(null);

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await checkBookmarkStatus(req, res);

      expect(prismaMock.bookmarks.findUnique).toHaveBeenCalledWith({
        where: {
          user_fk_resource_fk: {
            user_fk: 'user123',
            resource_fk: 'resource456',
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ bookmarked: false });
    });

    it('should return 401 when unauthorized', async () => {
      const req = mockReq({
        auth: {},
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await checkBookmarkStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const req = mockReq({
        auth: { userId: 'clerk_nonexistent' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await checkBookmarkStatus(req, res);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { clerk_id: 'clerk_nonexistent' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(prismaMock.bookmarks.findUnique).not.toHaveBeenCalled();
    });

    it('should handle errors during check', async () => {
      const mockUser = { id: 'user123', clerk_id: 'clerk_user123' };
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);
      prismaMock.bookmarks.findUnique.mockRejectedValue(new Error('Check failed'));

      const req = mockReq({
        auth: { userId: 'clerk_user123' },
        body: { resource_id: 'resource456' },
      });
      const res = mockRes();

      await checkBookmarkStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Failed to check bookmark' })
      );
    });
  });
});
