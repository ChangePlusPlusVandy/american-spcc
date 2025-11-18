import { Router } from 'express';
import {
  createCollection,
  getCollectionsByUser,
  getCollectionById,
  renameCollection,
  deleteCollection,
  addResourceToCollection,
  removeResourceFromCollection
} from '../controllers/collectionController';

const router = Router();

router.post('/', createCollection);
router.get('/user/:userId', getCollectionsByUser);
router.get('/:id', getCollectionById);
router.patch('/:id', renameCollection);
router.delete('/:id', deleteCollection);

router.post('/:collectionId/items', addResourceToCollection);
router.delete('/items/:itemId', removeResourceFromCollection);

export default router;
