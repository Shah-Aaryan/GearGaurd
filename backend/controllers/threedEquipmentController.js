// 3D Equipment Controller (CRUD)
import { DataTypes } from 'sequelize';
import { sequelize } from '../models/db.js';

const ThreedEquipment = sequelize.define('ThreedEquipment', {
  name: { type: DataTypes.STRING, allowNull: false },
  modelUrl: { type: DataTypes.STRING, allowNull: false }, // URL to 3D model file
  description: { type: DataTypes.STRING },
  equipmentId: { type: DataTypes.INTEGER } // Link to Equipment if needed
});

export async function createThreedEquipment(req, res) {
  try {
    const eq = await ThreedEquipment.create(req.body);
    res.status(201).json(eq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getThreedEquipments(req, res) {
  try {
    const eqs = await ThreedEquipment.findAll();
    res.json(eqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getThreedEquipmentById(req, res) {
  try {
    const eq = await ThreedEquipment.findByPk(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Not found' });
    res.json(eq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateThreedEquipment(req, res) {
  try {
    const eq = await ThreedEquipment.findByPk(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Not found' });
    await eq.update(req.body);
    res.json(eq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteThreedEquipment(req, res) {
  try {
    const eq = await ThreedEquipment.findByPk(req.params.id);
    if (!eq) return res.status(404).json({ error: 'Not found' });
    await eq.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default ThreedEquipment;
