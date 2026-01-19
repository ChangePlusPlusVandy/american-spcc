import express from 'express';
import {
  getAdminMe,
  updateAdminMe,
} from '../controllers/adminUserController';

const router = express.Router();

router.get('/me', getAdminMe);
router.patch('/me', updateAdminMe);

export default router;
