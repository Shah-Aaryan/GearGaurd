import express from 'express';
import {
  createWorkCenter,
  getWorkCenters,
  getWorkCenterById,
  updateWorkCenter,
  deleteWorkCenter
} from '../controllers/workCenterController.js';

const router = express.Router();

router.post('/', createWorkCenter);
router.get('/', getWorkCenters);
router.get('/:id', getWorkCenterById);
router.put('/:id', updateWorkCenter);
router.delete('/:id', deleteWorkCenter);

export default router;
