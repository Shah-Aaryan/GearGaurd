import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';
import Equipment from './Equipment.js';
import { MaintenanceTeam, Technician } from './MaintenanceTeam.js';

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
  type: { type: DataTypes.ENUM('Corrective', 'Preventive'), allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  scheduledDate: { type: DataTypes.DATE },
  duration: { type: DataTypes.FLOAT }, // hours
  stage: { type: DataTypes.ENUM('New', 'In Progress', 'Repaired', 'Scrap'), defaultValue: 'New' },
  overdue: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Associations
Equipment.hasMany(MaintenanceRequest);
MaintenanceRequest.belongsTo(Equipment);

MaintenanceTeam.hasMany(MaintenanceRequest);
MaintenanceRequest.belongsTo(MaintenanceTeam);

Technician.hasMany(MaintenanceRequest);
MaintenanceRequest.belongsTo(Technician, { as: 'AssignedTechnician' });

export default MaintenanceRequest;
