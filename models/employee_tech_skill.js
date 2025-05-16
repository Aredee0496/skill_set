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

EmployeeTechSkill.associate = (models) => {
  EmployeeTechSkill.belongsTo(models.Employee, {
    foreignKey: 'employee_id',
    as: 'employee'
  });

  EmployeeTechSkill.belongsTo(models.TechStack, {
    foreignKey: 'techstack_id',
    as: 'techstack'
  });

  EmployeeTechSkill.belongsTo(models.Level, {
    foreignKey: 'level_id',
    as: 'level'
  });
};

module.exports = EmployeeTechSkill;
