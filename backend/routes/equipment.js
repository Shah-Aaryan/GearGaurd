
import express from 'express';
import {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  getEquipmentRequests,
  scrapEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();


// Create Equipment
router.post('/', createEquipment);
// Get all Equipment
router.get('/', getAllEquipment);
// Get Equipment by ID
router.get('/:id', getEquipmentById);
// Get all requests for a specific equipment
router.get('/:id/requests', getEquipmentRequests);
// Scrap logic: mark equipment as scrapped
router.post('/:id/scrap', scrapEquipment);

export default router;
