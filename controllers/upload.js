const csv = require("csv-parser");
const {
  Employee,
  Prefix,
  Position,
  Skill,
  Project,
  Trend,
} = require("../models");
const { Readable } = require("stream");
const moment = require('moment');
 
exports.importEmployeeCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์ CSV" });
  const buffer = req.file.buffer.toString("utf8");
  const results = [];
  Readable.from(buffer)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const importResult = await processAndImportEmployees(results);
        res.status(200).json({
          message: "นำเข้าข้อมูลพนักงานสำเร็จ",
          importedCount: importResult.importedCount,
          failedCount: importResult.failedCount,
          errors: importResult.errors,
        });
      } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล", error: error.message });
      }
    })
    .on("error", (error) => res.status(500).json({ message: "เกิดข้อผิดพลาดในการอ่านไฟล์ CSV", error: error.message }));
};

async function processAndImportEmployees(csvData) {
  const importedEmployees = [], failedEmployees = [], errors = [];
  for (const row of csvData) {
    try {
      const [prefix, position, skill, project, trend] = await Promise.all([
        Prefix.findOne({ where: { name: row["คำนำหน้า"] } }),
        Position.findOne({ where: { name: row["ตำแหน่ง"] } }),
        Skill.findOne({ where: { name: row["Skills"] } }),
        Project.findOne({ where: { name: row["โปรเจกต์ที่กำลังทำ"] } }),
        Trend.findOne({ where: { name: row["Trend"] } })
      ]);
      const employeeData = {
        employee_id: row["รหัสพนักงาน"],
        prefix_id: prefix?.prefix_id || null,
        is_male: row["ชาย"] === "1" ? 1 : null,
        is_female: row["หญิง"] === "1" ? 1 : null,
        fname: row["ชื่อ"],
        lname: row["สกุล"],
        nname: row["ชื่อเล่น"],
        position_id: position?.position_id || null,
        skill_id: skill?.skill_id || null,
        project_id: project?.project_id || null,
        manager_name: row["หัวหน้างาน "] || null,
        trend_id: trend?.trend_id || null,
        dev_team_central: row["Dev ทีมกลาง"] === "TRUE" ? true : null,
        start_work_date_excel: row['วันที่เริ่มงาน'] && moment(row['วันที่เริ่มงาน'], 'DD/MM/YYYY').isValid() ? moment(row['วันที่เริ่มงาน'], 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
        trend_start_work_date: row['ผ่านทดลองงาน'] && moment(row['ผ่านทดลองงาน'], 'DD/MM/YYYY').isValid() ? moment(row['ผ่านทดลองงาน'], 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
      };
      importedEmployees.push(await Employee.create(employeeData));
    } catch (error) {
      failedEmployees.push({ employee_id: row["รหัสพนักงาน"], error: error.message });
      errors.push({ employee_id: row["รหัสพนักงาน"], error: error.message });
    }
  }
  return { importedCount: importedEmployees.length, failedCount: failedEmployees.length, errors };
}