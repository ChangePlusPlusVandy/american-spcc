import express from 'express';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} from '../controllers/resourceController';

const router = express.Router();

/**
 * Base path: /api/resources
 */
router.post('/', createResource); // Create a new resource
router.get('/', getResources); // Get all resources
router.get('/:id', getResourceById); // Get a single resource by ID
router.put('/:id', updateResource); // Update a resource
router.delete('/:id', deleteResource); // Delete a resource

export default router;
