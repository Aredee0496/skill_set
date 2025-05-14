const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Level = sequelize.define('Level', {
  level_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'level',
  timestamps: false,
});

module.exports = Level;
