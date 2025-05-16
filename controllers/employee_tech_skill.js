const { Employee, TechStack, Level, Prefix } = require('../models');

exports.getEmployeeTechSkill = async (req, res) => {
    try {
        const [employees, allLevels] = await Promise.all([
            Employee.findAll({
                attributes: ['employee_id', 'fname', 'lname', 'prefix_id'],
                include: [
                    { model: Prefix, attributes: ['name'], as: 'prefix' },
                    { model: TechStack, attributes: ['name'], through: { attributes: ['level_id'] }, as: 'techstacks' }
                ],
                order: [['employee_id', 'ASC']]
            }),
            Level.findAll({ attributes: ['level_id', 'name'] })
        ]);
        if (!employees) return res.status(404).json({ message: 'ไม่พบข้อมูลพนักงานและทักษะ' });
        const levelIdToName = Object.fromEntries(allLevels.map(lv => [lv.level_id, lv.name]));
        const formattedData = employees.map(emp => {
            const data = {
                "รหัสพนักงาน": emp.employee_id,
                "คำนำหน้า": emp.prefix?.name || null,
                "ชื่อ": emp.fname,
                "สกุล": emp.lname
            };
            (emp.techstacks || []).forEach(tech => {
                data[tech.name?.toUpperCase() || ""] = levelIdToName[tech.EmployeeTechSkill?.level_id] || null;
            });
            return data;
        });
        res.status(200).json(formattedData);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงานและทักษะ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลพนักงานและทักษะ', error: error.message });
    }
};