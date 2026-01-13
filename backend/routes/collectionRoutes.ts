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

import {
  authenticateUser,
  syncParentWithDB,
  requireParent,
} from '../middleware/auth';

const router = Router();

/**
 * All collection routes require:
 * 1. Clerk auth
 * 2. Parent synced to DB
 * 3. Parent authorization
 */
router.use(authenticateUser, syncParentWithDB, requireParent);

router.post('/', createCollection);
router.get('/', getCollectionsByUser);
router.get('/:id', getCollectionById);
router.patch('/:id', renameCollection);
router.delete('/:id', deleteCollection);

router.post('/:collectionId/items', addResourceToCollection);
router.delete('/items/:itemId', removeResourceFromCollection);

export default router;
