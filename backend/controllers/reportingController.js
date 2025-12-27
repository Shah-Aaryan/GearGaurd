// Reporting & Analytics Controller
import MaintenanceRequest from '../models/MaintenanceRequest.js';
import Equipment from '../models/Equipment.js';
import { MaintenanceTeam, Technician } from '../models/MaintenanceTeam.js';
import { Op } from 'sequelize';

// Workload Distribution — Requests by Technician
export async function getTechnicianWorkload(req, res) {
  try {
    const requests = await MaintenanceRequest.findAll({ include: [{ model: Technician, as: 'AssignedTechnician' }] });
    const map = {};
    requests.forEach(r => {
      const tech = r.AssignedTechnician ? r.AssignedTechnician.name : 'Unassigned';
      if (!map[tech]) map[tech] = { name: tech, count: 0, overdue: 0 };
      map[tech].count++;
      if (r.overdue) map[tech].overdue++;
    });
    res.json(Object.values(map));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Request Volume Trend — Requests Over Time (Monthly)
export async function getRequestVolumeTrend(req, res) {
  try {
    const requests = await MaintenanceRequest.findAll();
    const months = {};
    requests.forEach(r => {
      if (!r.scheduledDate) return;
      const month = r.scheduledDate.toISOString().slice(0, 7);
      if (!months[month]) months[month] = { month, Corrective: 0, Preventive: 0 };
      if (r.type === 'Corrective') months[month].Corrective++;
      else months[month].Preventive++;
    });
    res.json(Object.values(months));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Equipment Reliability — Top Failing Equipment
export async function getEquipmentBreakdowns(req, res) {
  try {
    const requests = await MaintenanceRequest.findAll({ where: { type: 'Corrective' }, include: [Equipment] });
    const map = {};
    requests.forEach(r => {
      const eq = r.Equipment ? r.Equipment.name : 'Unknown';
      if (!map[eq]) map[eq] = { name: eq, count: 0 };
      map[eq].count++;
    });
    const sorted = Object.values(map).sort((a, b) => b.count - a.count).slice(0, 5);
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Maintenance Type Impact — Corrective vs Preventive Success Rate
export async function getMaintenanceTypeImpact(req, res) {
  try {
    const totalPreventive = await MaintenanceRequest.count({ where: { type: 'Preventive' } });
    const totalCorrective = await MaintenanceRequest.count({ where: { type: 'Corrective' } });
    res.json({ preventive: totalPreventive, corrective: totalCorrective });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Request Aging — Overdue & Pending Status Breakdown
export async function getRequestAging(req, res) {
  try {
    const stages = ['New', 'In Progress', 'Repaired', 'Scrap'];
    const data = await Promise.all(stages.map(async stage => {
      const count = await MaintenanceRequest.count({ where: { stage } });
      const overdue = await MaintenanceRequest.count({ where: { stage, overdue: true } });
      return { stage, count, overdue };
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Team Productivity — Average Repair Duration per Team
export async function getTeamProductivity(req, res) {
  try {
    const teams = await MaintenanceTeam.findAll({ include: [MaintenanceRequest] });
    const data = teams.map(team => {
      const requests = team.MaintenanceRequests || [];
      const total = requests.reduce((sum, r) => sum + (r.duration || 0), 0);
      const avg = requests.length ? total / requests.length : 0;
      return { name: team.name, avg };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
