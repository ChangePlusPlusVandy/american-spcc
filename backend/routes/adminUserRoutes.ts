import express from 'express';
import { getAdminMe } from '../controllers/adminUserController';

const router = express.Router();

router.get('/me', getAdminMe);

export default router;
