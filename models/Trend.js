const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Trend = sequelize.define('Trend', {
  trend_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'trend',
  timestamps: false,
});

module.exports = Trend;
