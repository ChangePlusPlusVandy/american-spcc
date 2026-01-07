import express from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByClerkId,
  updateUser,
  deleteUser,
  updateCurrentUser,
} from '../controllers/userController';

const router = express.Router();

router.patch('/me', updateCurrentUser);
router.get('/', getAllUsers);
router.get('/clerk/:clerkId', getUserByClerkId);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
