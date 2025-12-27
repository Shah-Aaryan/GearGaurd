
import express from 'express';
import {
  createTeam,
  addTechnician,
  getTeams
} from '../controllers/teamController.js';

const router = express.Router();


// Create Team
router.post('/', createTeam);
// Add Technician to Team
router.post('/:teamId/technicians', addTechnician);
// Get all Teams with Members
router.get('/', getTeams);

export default router;
