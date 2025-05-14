const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js'); // ตรวจสอบให้เส้นทางถูกต้อง

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.STRING,
  },
  prefix_id: DataTypes.INTEGER,
  fname: {
    type: DataTypes.STRING,
    allowNull: false,  // ทำให้ fname เป็นค่าที่ต้องการ
  },
  lname: {
    type: DataTypes.STRING,
    allowNull: false,  // ทำให้ lname เป็นค่าที่ต้องการ
  },
  nname: DataTypes.STRING,
  position_id: DataTypes.INTEGER,
  skill_id: DataTypes.INTEGER,
  project_id: DataTypes.INTEGER,
  lead_id: DataTypes.INTEGER,
  trend_id: DataTypes.INTEGER,
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

// การกำหนดความสัมพันธ์
Employee.associate = (models) => {
  Employee.belongsTo(models.Prefix, { foreignKey: 'prefix_id' });
  Employee.belongsTo(models.Position, { foreignKey: 'position_id' });
  Employee.belongsTo(models.Skill, { foreignKey: 'skill_id' });
  Employee.belongsTo(models.Project, { foreignKey: 'project_id' });
  Employee.belongsTo(models.Employee, { foreignKey: 'id', as: 'lead' });
  Employee.belongsTo(models.Trend, { foreignKey: 'trend_id' });
};

module.exports = Employee;
