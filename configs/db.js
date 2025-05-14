const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.MY_DB, process.env.MY_USER, process.env.MY_PASSWORD, {
  host: process.env.MY_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;