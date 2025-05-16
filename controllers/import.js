const csv = require("csv-parser");
const { Employee, TechStack, Level, EmployeeTechSkill } = require("../models");
const { Readable } = require("stream");

exports.importEmployeeTechStackLevelCSV = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์ CSV สำหรับ Employee Tech Stack Level" });
  const buffer = req.file.buffer.toString("utf8");
  const results = [];
  Readable.from(buffer)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const importResult = await processAndImportEmployeeTechStackLevel(results);
        res.status(200).json({
          message: "นำเข้าข้อมูล Employee Tech Stack Level สำเร็จ",
          importedCount: importResult.importedCount,
          failedCount: importResult.failedCount,
          errors: importResult.errors,
        });
      } catch (error) {
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล Employee Tech Stack Level", error: error.message });
      }
    })
    .on("error", (error) => res.status(500).json({ message: "เกิดข้อผิดพลาดในการอ่านไฟล์ CSV", error: error.message }));
};

async function processAndImportEmployeeTechStackLevel(csvData) {
  const importedRecords = [], failedRecords = [], errors = [];
  const techStackNames = [
    "VUEJS","NUXTJS","REACT","NEXJS","ANGULAR","FLUTTER","NODEJS","TYPESCRIPT","GOLANG","PYTHON","LARAVEL","C#","JAVA","WORDPRESS","MYSQL/MARIA","POSTGRESQL","SQLSERVER","MONGODB","WINDOWSERVER","LINUX","DOCKER","DOCKERSWARM","K8S","CICD","AI"
  ];
  for (const row of csvData) {
    try {
      const employee = await Employee.findOne({ where: { employee_id: row["รหัสพนักงาน"] } });
      if (!employee) {
        failedRecords.push({ row, error: "ไม่พบรหัสพนักงานนี้ในระบบ" });
        errors.push({ row, error: "ไม่พบรหัสพนักงานนี้ในระบบ" });
        continue;
      }
      for (const techStackName of techStackNames) {
        const levelName = row[techStackName];
        if (!levelName) continue;
        const techStack = await TechStack.findOne({ where: { name: techStackName } });
        if (!techStack) {
          failedRecords.push({ row, error: `ไม่พบชื่อ Tech Stack: ${techStackName} ในระบบ` });
          errors.push({ row, error: `ไม่พบชื่อ Tech Stack: ${techStackName} ในระบบ` });
          continue;
        }
        const level = await Level.findOne({ where: { name: levelName } });
        if (!level) {
          failedRecords.push({ row, error: `ไม่พบชื่อ Level: ${levelName} ในระบบ` });
          errors.push({ row, error: `ไม่พบชื่อ Level: ${levelName} ในระบบ` });
          continue;
        }
        const [createdRecord, wasCreated] = await EmployeeTechSkill.findOrCreate({
          where: { employee_id: employee.id, techstack_id: techStack.techstack_id },
          defaults: { employee_id: employee.id, techstack_id: techStack.techstack_id, level_id: level.level_id },
        });
        if (wasCreated) importedRecords.push(createdRecord);
      }
    } catch (error) {
      failedRecords.push({ row, error: error.message });
      errors.push({ row, error: error.message });
    }
  }
  return { importedCount: importedRecords.length, failedCount: failedRecords.length, errors };
}
