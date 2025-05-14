const { Employee, Prefix, Position, Skill, Project, Trend } = require('../models');

// 📥 สร้างพนักงานใหม่
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างพนักงาน', error });
  }
};

// 📤 อ่านข้อมูลพนักงานทั้งหมด
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
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
        'lead_id',
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
          model: Employee,
          as: 'lead',
          attributes: ['fname', 'lname'],
        },
        {
          model: Trend,
          as: 'trend',
          attributes: ['name'],
        },
      ],
    });

    const formattedEmployees = employees.map(employee => {
    return {
        id: employee.id,
        employee_id: employee.employee_id,
        prefix: employee.prefix ? employee.prefix.name : null,
        fname: employee.fname,
        lname: employee.lname,
        nname: employee.nname,
        position: employee.position ? employee.position.name : null,
        skill: employee.skill ? employee.skill.name : null,
        project: employee.project ? employee.project.name : null,
        lead: employee.lead ? `${employee.lead.fname} ${employee.lead.lname}` : null,
        trend: employee.trend ? employee.trend.name : null,
    };
});

    res.status(200).json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน', error });
    console.log(error);
  }
};


// 🔍 อ่านข้อมูลพนักงานรายตัว
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน', error });
  }
};

// ✏️ แก้ไขข้อมูลพนักงาน
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

// ❌ ลบพนักงาน
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'ไม่พบพนักงาน' });

    await employee.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบพนักงาน', error });
  }
};
