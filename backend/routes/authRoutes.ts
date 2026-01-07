import express from 'express';
import { requireAuth } from '@clerk/express';
import { syncUser } from '../controllers/userController';

const router = express.Router();

router.post('/sync-user', requireAuth(), (req, res, next) => {
  console.log('🟢 requireAuth passed');
  next();
}, syncUser);

export default router;
