const { Employee, Prefix, Position, Skill, Project, Trend } = require('../models'); // นำเข้าโมเดลที่จำเป็น

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
      include: [
        {
          model: Prefix, // ดึงข้อมูลจากตาราง Prefix
          attributes: ['id', 'name'], // เลือกแค่ฟิลด์ที่ต้องการ
        },
        {
          model: Position, // ดึงข้อมูลจากตาราง Position
          attributes: ['id', 'title'],
        },
        {
          model: Skill, // ดึงข้อมูลจากตาราง Skill
          attributes: ['id', 'skill_name'],
        },
        {
          model: Project, // ดึงข้อมูลจากตาราง Project
          attributes: ['id', 'project_name'],
        },
        {
          model: Employee, // ดึงข้อมูลจากตาราง Employee สำหรับ lead_id
          as: 'lead', // ตั้งชื่อ alias เพื่อหลีกเลี่ยงความขัดแย้ง
          attributes: ['id', 'fname', 'lname'], // เลือกฟิลด์ที่ต้องการ
        },
        {
          model: Trend, // ดึงข้อมูลจากตาราง Trend
          attributes: ['id', 'trend_name'],
        },
      ],
    });

    res.status(200).json(employees);
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
