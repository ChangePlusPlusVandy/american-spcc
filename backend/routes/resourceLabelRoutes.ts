import express from 'express';
import {
  createResourceLabel,
  getAllResourceLabels,
  getResourceLabelById,
  updateResourceLabel,
  deleteResourceLabel,
} from '../controllers/resourceLabelController';

const router = express.Router();

router.post('/', createResourceLabel);
router.get('/', getAllResourceLabels);
router.get('/:id', getResourceLabelById);
router.put('/:id', updateResourceLabel);
router.delete('/:id', deleteResourceLabel);

export default router;
