const { Employee, Prefix, Position, Skill, Project, Trend } = require('../models');
const sequelize = require('../configs/db.js');


exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างพนักงาน', error });
  }
}; 

exports.getEmployeesByPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      attributes: [
        'id',
        'employee_id',
        'prefix_id',
        'fname',
        'lname',
        'nname',
        'position_id',
        'skill_id',
        'project_id',
        'manager_name',
        'trend_id',
      ],
      include: [
        {
          model: Prefix,
          as: 'prefix',
          attributes: ['name'],
        },
        {
          model: Position,
          as: 'position',
          attributes: ['name'],
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['name'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name'],
        },
        {
          model: Trend,
          as: 'trend',
          attributes: ['name'],
        },
      ],
      limit,
      offset,
    });

    const formattedEmployees = rows.map(employee => ({
      id: employee.id,
      employee_id: employee.employee_id,
      prefix: employee.prefix ? employee.prefix.name : null,
      fname: employee.fname,
      lname: employee.lname,
      nname: employee.nname,
      position: employee.position ? employee.position.name : null,
      skill: employee.skill ? employee.skill.name : null,
      project: employee.project ? employee.project.name : null,
      manager_name: employee.manager_name,
      trend: employee.trend ? employee.trend.name : null,
    }));

    res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      employees: formattedEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงานแบบแบ่งหน้า', error });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      attributes: [
        'id',
        'employee_id',
        'prefix_id',
        'fname',
        'lname',
        'nname',
        'position_id',
        'skill_id',
        'project_id',
        'manager_name',
        'trend_id',
      ],
      include: [
        {
          model: Prefix,
          as: 'prefix',
          attributes: ['name'],
        },
        {
          model: Position,
          as: 'position',
          attributes: ['name'],
        },
        {
          model: Skill,
          as: 'skill',
          attributes: ['name'],
        },
        {
          model: Project,
          as: 'project',
          attributes: ['name'],
        },
        {
          model: Trend,
          as: 'trend',
          attributes: ['name'],
        },
      ],
    });

    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    const formattedEmployee = {
      id: employee.id,
      employee_id: employee.employee_id,
      prefix: employee.prefix ? employee.prefix.name : null,
      fname: employee.fname,
      lname: employee.lname,
      nname: employee.nname,
      position: employee.position ? employee.position.name : null,
      skill: employee.skill ? employee.skill.name : null,
      project: employee.project ? employee.project.name : null,
      manager_name: employee.manager_name,
      trend: employee.trend ? employee.trend.name : null,
    };

    res.status(200).json(formattedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน', error });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    await employee.update(req.body);
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตพนักงาน', error });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    await employee.destroy();
    res.status(204).send(); 
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบพนักงาน', error });
  }
};

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
      message: 'เกิดข้อผิดพลาดในการคำนวณเปอร์เซ็นต์พนักงานตามโปรเจกต์',
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
      message: 'เกิดข้อผิดพลาดในการคำนวณเปอร์เซ็นต์พนักงานตามเทรนด์',
      error
    });
  }
};