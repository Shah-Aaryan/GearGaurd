
import express from 'express';
import {
  createRequest,
  getAllRequests,
  updateRequest,
  getCalendarRequests
} from '../controllers/requestController.js';

const router = express.Router();


// Create Maintenance Request
router.post('/', createRequest);
// Get all requests (with filters)
router.get('/', getAllRequests);
// Update request
router.patch('/:id', updateRequest);
// Calendar view: get all preventive requests by date
router.get('/calendar', getCalendarRequests);

export default router;
