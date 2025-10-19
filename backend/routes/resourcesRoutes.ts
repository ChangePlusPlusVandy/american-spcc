import { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';

const router = Router();

// CRUD routes for Resources
router.get('/', getResources); // GET all resources
router.get('/:id', getResourceById); // GET single resource by ID
router.post('/', createResource); // POST create a new resource
router.put('/:id', updateResource); // PUT update an existing resource
router.delete('/:id', deleteResource); // DELETE a resource

// quick route health check
router.get('/test', (req, res) => res.send('✅ resourceRoutes loaded successfully'));

export default router;
