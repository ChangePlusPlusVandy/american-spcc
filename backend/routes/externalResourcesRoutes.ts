import express from 'express';
import {
  createExternalResources,
  getAllExternalResources,
  getExternalResourcesById,
  updateExternalResources,
  deleteExternalResources,
} from '../controllers/externalResourcesController';

const router = express.Router();

router.post('/', createExternalResources);
router.get('/', getAllExternalResources);
router.get('/:id', getExternalResourcesById);
router.put('/:id', updateExternalResources);
router.delete('/:id', deleteExternalResources);
export default router;
