import express from 'express';
import { createAdminLog, getAllAdminLogs } from '../controllers/adminLogsController';

const router = express.Router();

router.post('/', createAdminLog);
router.get('/', getAllAdminLogs);

export default router;
