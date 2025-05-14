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

// 👉 กำหนดความสัมพันธ์ที่นี่
EmployeeTechSkill.associate = (models) => {
  EmployeeTechSkill.belongsTo(models.Employee, {
    foreignKey: 'employee_id'
  });

  EmployeeTechSkill.belongsTo(models.Techstack, {
    foreignKey: 'techstack_id'
  });

  EmployeeTechSkill.belongsTo(models.Level, {
    foreignKey: 'level_id'
  });
};

module.exports = EmployeeTechSkill;
