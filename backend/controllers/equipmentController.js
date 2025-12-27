// Equipment Controller
import Equipment from '../models/Equipment.js';
import MaintenanceRequest from '../models/MaintenanceRequest.js';

export async function createEquipment(req, res) {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllEquipment(req, res) {
  try {
    const equipment = await Equipment.findAll();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getEquipmentById(req, res) {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Not found' });
    const openRequests = await MaintenanceRequest.count({ where: { EquipmentId: equipment.id, stage: ['New', 'In Progress'] } });
    res.json({ ...equipment.toJSON(), openRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getEquipmentRequests(req, res) {
  try {
    const requests = await MaintenanceRequest.findAll({ where: { EquipmentId: req.params.id } });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function scrapEquipment(req, res) {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Not found' });
    equipment.isScrapped = true;
    await equipment.save();
    res.json({ message: 'Equipment scrapped' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
