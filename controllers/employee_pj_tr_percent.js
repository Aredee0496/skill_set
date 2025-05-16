const { Employee, Prefix, Position, Skill, Project, Trend } = require('../models');
const sequelize = require('../configs/db.js');


exports.getProjectEmployeePercentage = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();

    const projectStats = await Employee.findAll({
      attributes: [
        [sequelize.col('Employee.project_id'), 'project_id'],
        [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'employee_count'],
        [sequelize.col('project.name'), 'project_name']
      ],
      include: [
        {
          model: Project,
          as: 'project',
          attributes: []
        }
      ],
      group: ['Employee.project_id', 'project.name']
    });

    const result = projectStats.map(stat => {
      const employeeCount = parseInt(stat.get('employee_count'), 10);
      const percentage = ((employeeCount / totalEmployees) * 100).toFixed(2);
      return {
        project_id: stat.get('project_id'),
        project_name: stat.get('project_name'),
        employee_count: employeeCount,
        percentage
      };
    });

    res.json({
      totalEmployees,
      projectStats: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'error',
      error
    });
  }
};

exports.getTrendEmployeePercentage = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();

    const trendStats = await Employee.findAll({
      attributes: [
        [sequelize.col('Employee.trend_id'), 'trend_id'],
        [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'employee_count'],
        [sequelize.col('trend.name'), 'trend_name']
      ],
      include: [
        {
          model: Trend,
          as: 'trend',
          attributes: []
        }
      ],
      group: ['Employee.trend_id', 'trend.name']
    });

    const result = trendStats.map(stat => {
      const employeeCount = parseInt(stat.get('employee_count'), 10);
      const percentage = totalEmployees > 0
        ? ((employeeCount / totalEmployees) * 100).toFixed(2)
        : 0;

      return {
        trend_id: stat.get('trend_id'),
        trend_name: stat.get('trend_name'),
        employee_count: employeeCount,
        percentage: Number(percentage)
      };
    });

    res.json({
      totalEmployees,
      trendStats: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'error',
      error
    });
  }
};