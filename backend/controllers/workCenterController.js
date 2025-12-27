// Work Center Controller (CRUD)
import { DataTypes } from 'sequelize';
import { sequelize } from '../models/db.js';

const WorkCenter = sequelize.define('WorkCenter', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  location: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING }
});

export async function createWorkCenter(req, res) {
  try {
    const wc = await WorkCenter.create(req.body);
    res.status(201).json(wc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getWorkCenters(req, res) {
  try {
    const wcs = await WorkCenter.findAll();
    res.json(wcs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getWorkCenterById(req, res) {
  try {
    const wc = await WorkCenter.findByPk(req.params.id);
    if (!wc) return res.status(404).json({ error: 'Not found' });
    res.json(wc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateWorkCenter(req, res) {
  try {
    const wc = await WorkCenter.findByPk(req.params.id);
    if (!wc) return res.status(404).json({ error: 'Not found' });
    await wc.update(req.body);
    res.json(wc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteWorkCenter(req, res) {
  try {
    const wc = await WorkCenter.findByPk(req.params.id);
    if (!wc) return res.status(404).json({ error: 'Not found' });
    await wc.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default WorkCenter;
