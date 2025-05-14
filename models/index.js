const Employee = require('./Employee');
const Prefix = require('./Prefix');
const Position = require('./Position');
const Skill = require('./Skill');
const Project = require('./Project');
const Trend = require('./Trend');
const TechStack = require('./TechStack');

const models = { Employee, Prefix, Position, Skill, Project, Trend, TechStack }; // <--- เพิ่ม TechStack

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;