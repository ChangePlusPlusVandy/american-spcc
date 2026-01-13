import express from 'express';
import { requireAuth } from '@clerk/express';
import { syncUser } from '../controllers/userController';
import { getMe } from '../controllers/authController';

const router = express.Router();

router.post('/sync-user', requireAuth(), syncUser);
router.get('/me', requireAuth(), getMe);

export default router;
