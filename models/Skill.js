const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Skill = sequelize.define('Skill', {
  skill_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'skill',
  timestamps: false,
});

module.exports = Skill;
