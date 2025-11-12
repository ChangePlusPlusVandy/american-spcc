import express from 'express';
import {
  createResourceView,
  getAllResourceViews,
  getResourceViewById,
  updateResourceView,
  deleteResourceView,
} from '../controllers/resourceViewController';

const router = express.Router();

router.post('/', createResourceView);
router.get('/', getAllResourceViews);
router.get('/:id', getResourceViewById);
router.put('/:id', updateResourceView);
router.delete('/:id', deleteResourceView);
export default router;
