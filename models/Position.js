const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Position = sequelize.define('Position', {
  position_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'position',
  timestamps: false,
});

module.exports = Position;
