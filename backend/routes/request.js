import express from 'express';
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';
import { MaintenanceTeam, Technician } from '../models/MaintenanceTeam.js';
import { Op } from 'sequelize';

const router = express.Router();

// Create Maintenance Request (auto-fill logic)
router.post('/', async (req, res) => {
  try {
    const { equipmentId, type, subject, scheduledDate } = req.body;
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    // Auto-fill: get team from equipment (assume department = team for demo)
    const team = await MaintenanceTeam.findOne({ where: { name: equipment.department } });
    const request = await MaintenanceRequest.create({
      EquipmentId: equipment.id,
      MaintenanceTeamId: team ? team.id : null,
      type,
      subject,
      scheduledDate
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all requests (with filters)
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.stage) where.stage = req.query.stage;
    if (req.query.type) where.type = req.query.type;
    if (req.query.teamId) where.MaintenanceTeamId = req.query.teamId;
    if (req.query.equipmentId) where.EquipmentId = req.query.equipmentId;
    const requests = await MaintenanceRequest.findAll({ where });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update request stage, assign technician, set duration, scrap logic
router.patch('/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Not found' });
    if (req.body.stage) request.stage = req.body.stage;
    if (req.body.technicianId) request.AssignedTechnicianId = req.body.technicianId;
    if (req.body.duration) request.duration = req.body.duration;
    if (req.body.stage === 'Scrap') {
      const equipment = await Equipment.findByPk(request.EquipmentId);
      if (equipment) {
        equipment.isScrapped = true;
        await equipment.save();
      }
    }
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Calendar view: get all preventive requests by date
router.get('/calendar', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.findAll({
      where: {
        type: 'Preventive',
        scheduledDate: { [Op.not]: null }
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
