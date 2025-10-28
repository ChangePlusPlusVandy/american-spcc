import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByClerkId,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/clerk/:clerkId', getUserByClerkId);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;