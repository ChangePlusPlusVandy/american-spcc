import express from 'express';
import {
  createLabel,
  getAllLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
} from '../controllers/categoryLabelController';

const router = express.Router();

router.post('/', createLabel);
router.get('/', getAllLabels);
router.get('/:id', getLabelById);
router.put('/:id', updateLabel);
router.delete('/:id', deleteLabel);

export default router;
