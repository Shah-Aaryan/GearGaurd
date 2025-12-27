import express from 'express';
import {
  createThreedEquipment,
  getThreedEquipments,
  getThreedEquipmentById,
  updateThreedEquipment,
  deleteThreedEquipment
} from '../controllers/threedEquipmentController.js';

const router = express.Router();

router.post('/', createThreedEquipment);
router.get('/', getThreedEquipments);
router.get('/:id', getThreedEquipmentById);
router.put('/:id', updateThreedEquipment);
router.delete('/:id', deleteThreedEquipment);

export default router;
