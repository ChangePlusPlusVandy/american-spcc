import express from 'express';
import { createLabel, getLabels } from '../controllers/categoryLabelController';

const router = express.Router();

/**
 * Base path: /api/labels
 */
router.post('/', createLabel); // Create a new label
router.get('/', getLabels); // Get all labels (optional category filter)

export default router;
