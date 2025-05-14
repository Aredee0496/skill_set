const Sequelize = require('sequelize');
const sequelize = require('../configs/db'); // เชื่อมต่อฐานข้อมูล

const Employee = require('./Employee');
const Prefix = require('./Prefix');
const Position = require('./Position');
const Skill = require('./Skill');
const Project = require('./Project');
const Trend = require('./Trend');

Employee.associate({ Prefix, Position, Skill, Project, Trend, Employee });

module.exports = {
  Employee,
  Prefix,
  Position,
  Skill,
  Project,
  Trend,
}

