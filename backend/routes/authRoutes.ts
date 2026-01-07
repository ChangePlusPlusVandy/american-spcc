import express from 'express';
import { syncUser } from '../controllers/userController';
import { requireAuth } from '@clerk/express';

const router = express.Router();

// 🔐 MUST require auth so Clerk attaches userId
router.post('/sync-user', requireAuth(), syncUser);

export default router;

