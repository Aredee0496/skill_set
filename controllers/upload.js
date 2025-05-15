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
  if (!req.file) {
    return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์ CSV" });
  }

  const results = [];
  const buffer = req.file.buffer.toString("utf8"); // อ่าน Buffer เป็น String
  const readableStream = Readable.from(buffer);

  readableStream
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const importResult = await processAndImportEmployees(results);
        return res
          .status(200)
          .json({
            message: "นำเข้าข้อมูลพนักงานสำเร็จ",
            importedCount: importResult.importedCount,
            failedCount: importResult.failedCount,
            errors: importResult.errors,
          });
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการนำเข้าข้อมูล:", error);
        return res
          .status(500)
          .json({
            message: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล",
            error: error.message,
          });
      }
    })
    .on("error", (error) => {
      console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV:", error);
      return res
        .status(500)
        .json({
          message: "เกิดข้อผิดพลาดในการอ่านไฟล์ CSV",
          error: error.message,
        });
    });
};

async function processAndImportEmployees(csvData) {
  const importedEmployees = [];
  const failedEmployees = [];
  const errors = [];

  for (const row of csvData) {
    try {
      // Lookup reference IDs
      const [prefixRecord, positionRecord, skillRecord, projectRecord, trendRecord] = await Promise.all([
        Prefix.findOne({ where: { name: row["คำนำหน้า"] } }),
        Position.findOne({ where: { name: row["ตำแหน่ง"] } }),
        Skill.findOne({ where: { name: row["Skills"] } }),
        Project.findOne({ where: { name: row["โปรเจกต์ที่กำลังทำ"] } }),
        Trend.findOne({ where: { name: row["Trend"] } })
      ]);

      // Manager name
      const managerNameFromCSV = row["หัวหน้างาน "];

      // Dates
      const startDateExcel = row['วันที่เริ่มงาน'] && moment(row['วันที่เริ่มงาน'], 'DD/MM/YYYY').isValid()
        ? moment(row['วันที่เริ่มงาน'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;
      const trendStartDate = row['ผ่านทดลองงาน'] && moment(row['ผ่านทดลองงาน'], 'DD/MM/YYYY').isValid()
        ? moment(row['ผ่านทดลองงาน'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        : null;

      const employeeData = {
        employee_id: row["รหัสพนักงาน"],
        prefix_id: prefixRecord?.prefix_id || null,
        is_male: row["ชาย"] === "1" ? 1 : null,
        is_female: row["หญิง"] === "1" ? 1 : null,
        fname: row["ชื่อ"],
        lname: row["สกุล"],
        nname: row["ชื่อเล่น"],
        position_id: positionRecord?.position_id || null,
        skill_id: skillRecord?.skill_id || null,
        project_id: projectRecord?.project_id || null,
        manager_name: managerNameFromCSV || null,
        trend_id: trendRecord?.trend_id || null,
        dev_team_central: row["Dev ทีมกลาง"] === "TRUE" ? true : null,
        start_work_date_excel: startDateExcel,
        trend_start_work_date: trendStartDate,
      };
      console.log('ข้อมูลพนักงาน:', employeeData);
      const createdEmployee = await Employee.create(employeeData);
      importedEmployees.push(createdEmployee);
    } catch (error) {
      console.error("Error processing and importing row:", row["รหัสพนักงาน"], error);
      failedEmployees.push({ employee_id: row["รหัสพนักงาน"], error: error.message });
      errors.push({ employee_id: row["รหัสพนักงาน"], error: error.message });
    }
  }

  return {
    importedCount: importedEmployees.length,
    failedCount: failedEmployees.length,
    errors,
  };
}