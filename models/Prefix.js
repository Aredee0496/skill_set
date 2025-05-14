const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.js');

const Prefix = sequelize.define('Prefix', {
  prefix_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'prefix',
  timestamps: false,
});

module.exports = Prefix;
