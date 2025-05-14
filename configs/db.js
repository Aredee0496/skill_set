const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydb', 'user', 'userpass', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;