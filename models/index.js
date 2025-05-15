const Employee = require('./employee');
const Prefix = require('./prefix');
const Position = require('./position');
const Skill = require('./skill');
const Project = require('./project');
const Trend = require('./trend');
const TechStack = require('./tech_stack');
const EmployeeTechSkill = require('./employee_tech_skill');
const Level = require('./level');

const models = { Employee, Prefix, Position, Skill, Project, Trend, TechStack, EmployeeTechSkill, Level };

Object.values(models).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;