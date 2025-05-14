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
  frontend: {
    type: DataTypes.JSON, // เก็บข้อมูล JSON ที่มีหลาย techstack_id
    allowNull: true,
  },
  backend: {
    type: DataTypes.JSON, // เก็บข้อมูล JSON ที่มีหลาย techstack_id
    allowNull: true,
  },
  database: {
    type: DataTypes.JSON, // เก็บข้อมูล JSON ที่มีหลาย techstack_id
    allowNull: true,
  },
  others: {
    type: DataTypes.JSON, // เก็บข้อมูล JSON ที่มีหลาย techstack_id
    allowNull: true,
  },
}, {
  tableName: 'project',
  timestamps: false,
});

// การกำหนดความสัมพันธ์ (ถ้าต้องการ)
Project.associate = (models) => {
  Project.belongsTo(models.TechStack, { foreignKey: 'techstack_id' });
};

module.exports = Project;
