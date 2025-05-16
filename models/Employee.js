const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.STRING,
    unique: true,
  },
  prefix_id: DataTypes.INTEGER,
  is_male: { 
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  is_female: { 
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  fname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nname: DataTypes.STRING,
  position_id: DataTypes.INTEGER,
  skill_id: DataTypes.INTEGER,
  project_id: DataTypes.INTEGER,
  manager_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trend_id: DataTypes.INTEGER,
  dev_team_central: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  start_work_date_excel: DataTypes.DATE, 
  trend_start_work_date: DataTypes.DATE, 
}, {
  tableName: 'employee',
  timestamps: false,
  indexes: [
    {
      unique: false,
      fields: ['position_id'],
    },
  ],
}); 

Employee.associate = (models) => {
    Employee.belongsTo(models.Prefix, { foreignKey: 'prefix_id', as: 'prefix' }); 
    Employee.belongsTo(models.Position, { foreignKey: 'position_id', as: 'position' }); 
    Employee.belongsTo(models.Skill, { foreignKey: 'skill_id', as: 'skill' }); 
    Employee.belongsTo(models.Project, { foreignKey: 'project_id', as: 'project' }); 
    Employee.belongsTo(models.Trend, { foreignKey: 'trend_id', as: 'trend' }); 
    Employee.belongsToMany(models.TechStack, {
      through: 'EmployeeTechSkill', // ชื่อตารางกลาง
      foreignKey: 'employee_id', // Foreign Key ในตารางกลางที่อ้างอิง Employee
      otherKey: 'techstack_id', // Foreign Key ในตารางกลางที่อ้างอิง TechStack
      as: 'techstacks' // Alias สำหรับความสัมพันธ์นี้
    });
};

module.exports = Employee;
