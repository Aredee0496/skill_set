const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const TechStack = sequelize.define('TechStack', {
  techstack_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tech_stack',
  timestamps: false,
});

module.exports = TechStack;
