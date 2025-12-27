import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const MaintenanceTeam = sequelize.define('MaintenanceTeam', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Technician = sequelize.define('Technician', {
  name: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING } // URL or path to avatar image
});

// Team has many Technicians
MaintenanceTeam.hasMany(Technician, { as: 'Members' });
Technician.belongsTo(MaintenanceTeam);

export { MaintenanceTeam, Technician };
