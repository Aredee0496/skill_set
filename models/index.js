const Employee = require('./employee');
const Prefix = require('./prefix');
const Position = require('./position');
const Skill = require('./skill');
const Project = require('./project');
const Trend = require('./trend');
const TechStack = require('./tech_stack');

const models = { Employee, Prefix, Position, Skill, Project, Trend, TechStack };

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;