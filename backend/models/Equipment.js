import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const Equipment = sequelize.define('Equipment', {
  name: { type: DataTypes.STRING, allowNull: false },
  serialNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  purchaseDate: { type: DataTypes.DATE, allowNull: false },
  warrantyInfo: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  owner: { type: DataTypes.STRING }, // Employee name
  isScrapped: { type: DataTypes.BOOLEAN, defaultValue: false }
});

export default Equipment;
