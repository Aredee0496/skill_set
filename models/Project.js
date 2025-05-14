const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Project = sequelize.define('Project', {
  project_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'project',
  timestamps: false,
});

module.exports = Project;
