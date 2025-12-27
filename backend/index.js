dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models/db.js';
import Equipment from './models/Equipment.js';
import { MaintenanceTeam, Technician } from './models/MaintenanceTeam.js';
import MaintenanceRequest from './models/MaintenanceRequest.js';
import equipmentRoutes from './routes/equipment.js';
import teamRoutes from './routes/team.js';
import requestRoutes from './routes/request.js';
import reportingRoutes from './routes/reporting.js';
import workCenterRoutes from './routes/workcenter.js';
import threedEquipmentRoutes from './routes/threedEquipment.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/equipment', equipmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reporting', reportingRoutes);
app.use('/api/workcenters', workCenterRoutes);
app.use('/api/threed-equipments', threedEquipmentRoutes);

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
