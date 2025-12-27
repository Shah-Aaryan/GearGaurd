// Maintenance Request Controller
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';
import { MaintenanceTeam, Technician } from '../models/MaintenanceTeam.js';
import { Op } from 'sequelize';

export async function createRequest(req, res) {
  try {
    const { equipmentId, type, subject, scheduledDate } = req.body;
    const equipment = await Equipment.findByPk(equipmentId);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
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
}

export async function getAllRequests(req, res) {
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
}

export async function updateRequest(req, res) {
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
}

export async function getCalendarRequests(req, res) {
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
}
