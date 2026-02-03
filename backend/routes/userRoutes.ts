import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByClerkId,
  updateUser,
  deleteUser,
  updateCurrentUser,
} from '../controllers/userController';
import { clerkMiddleware, requireAuth } from '@clerk/express';

const router = express.Router();
router.use(clerkMiddleware());

router.patch('/me', requireAuth(), updateCurrentUser);
router.get('/', getAllUsers);
router.get('/clerk/:clerkId', getUserByClerkId);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
