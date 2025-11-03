import express from 'express';
import {
  createInternalHostedResource,
  getAllInternalHostedResources,
  getInternalHostedResourceById,
  updateInternalHostedResource,
  deleteInternalHostedResource,
} from '../controllers/internalHostedResourcesController';

const router = express.Router();

router.post('/', createInternalHostedResource);
router.get('/', getAllInternalHostedResources);
router.get('/:id', getInternalHostedResourceById);
router.put('/:id', updateInternalHostedResource);
router.delete('/:id', deleteInternalHostedResource);
export default router;