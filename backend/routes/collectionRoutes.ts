import { Router } from 'express';
import {
  createCollection,
  getCollectionsByUser,
  getCollectionById,
  renameCollection,
  deleteCollection,
  addResourceToCollection,
  removeResourceFromCollection,
} from '../controllers/collectionController';

import { authenticateUser } from '../middleware/auth';

const router = Router();

/**
 * Only require Clerk auth.
 * Parent is resolved inside controllers.
 */
router.use(authenticateUser);

router.post('/', createCollection);
router.get('/', getCollectionsByUser);
router.get('/:id', getCollectionById);
router.patch('/:id', renameCollection);
router.delete('/:id', deleteCollection);

router.post('/:collectionId/items', addResourceToCollection);
router.delete('/items/:itemId', removeResourceFromCollection);

export default router;
