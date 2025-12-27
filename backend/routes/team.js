import express from 'express';
import { MaintenanceTeam, Technician } from '../models/MaintenanceTeam.js';

const router = express.Router();

// Create Team
router.post('/', async (req, res) => {
  try {
    const team = await MaintenanceTeam.create({ name: req.body.name });
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add Technician to Team
router.post('/:teamId/technicians', async (req, res) => {
  try {
    const team = await MaintenanceTeam.findByPk(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const tech = await Technician.create({ ...req.body, MaintenanceTeamId: team.id });
    res.status(201).json(tech);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Teams with Members
router.get('/', async (req, res) => {
  try {
    const teams = await MaintenanceTeam.findAll({ include: 'Members' });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
