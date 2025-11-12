import express from 'express';
import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  searchResources,
  deleteResource,
} from '../controllers/resourceController';

const router = express.Router();

router.get('/search', searchResources);
router.post('/', createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
export default router;
