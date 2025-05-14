const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const EmployeeTechSkill = sequelize.define('EmployeeTechSkill', {
  employee_tech_skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  techstack_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  level_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'employee_tech_skill',
  timestamps: false,
});

module.exports = EmployeeTechSkill;
