const csv = require("csv-parser");
const { Employee, TechStack, Level, EmployeeTechSkill } = require("../models");
const { Readable } = require("stream");

exports.importEmployeeTechStackLevelCSV = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({
        message: "กรุณาอัปโหลดไฟล์ CSV สำหรับ Employee Tech Stack Level",
      });
  }

  const results = [];
  const buffer = req.file.buffer.toString("utf8");
  const readableStream = Readable.from(buffer);

  readableStream
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const importResult = await processAndImportEmployeeTechStackLevel(
          results
        );
        return res.status(200).json({
          message: "นำเข้าข้อมูล Employee Tech Stack Level สำเร็จ",
          importedCount: importResult.importedCount,
          failedCount: importResult.failedCount,
          errors: importResult.errors,
        });
      } catch (error) {
        console.error(
          "เกิดข้อผิดพลาดในการนำเข้าข้อมูล Employee Tech Stack Level:",
          error
        );
        return res.status(500).json({
          message: "เกิดข้อผิดพลาดในการนำเข้าข้อมูล Employee Tech Stack Level",
          error: error.message,
        });
      }
    })
    .on("error", (error) => {
      console.error("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV:", error);
      return res.status(500).json({
        message: "เกิดข้อผิดพลาดในการอ่านไฟล์ CSV",
        error: error.message,
      });
    });
};

async function processAndImportEmployeeTechStackLevel(csvData) {
  const importedRecords = [];
  const failedRecords = [];
  const errors = [];

  const techStackColumnMapping = {
    VUEJS: "VUEJS",
    NUXTJS: "NUXTJS",
    REACT: "REACT",
    NEXJS: "NEXJS",
    ANGULAR: "ANGULAR",
    FLUTTER: "FLUTTER",
    NODEJS: "NODEJS",
    TYPESCRIPT: "TYPESCRIPT",
    GOLANG: "GOLANG",
    PYTHON: "PYTHON",
    LARAVEL: "LARAVEL",
    "C#": "C#",
    JAVA: "JAVA",
    WORDPRESS: "WORDPRESS",
    "MYSQL/MARIA": "MYSQL/MARIA",
    POSTGRESQL: "POSTGRESQL",
    SQLSERVER: "SQLSERVER",
    MONGODB: "MONGODB",
    WINDOWSERVER: "WINDOWSERVER",
    LINUX: "LINUX",
    DOCKER: "DOCKER",
    DOCKERSWARM: "DOCKERSWARM",
    K8S: "K8S",
    CICD: "CICD",
    AI: "AI",
  };

  for (const row of csvData) {
    try {
      // 1. หา employee.id จาก employee_id (string)
      const employee = await Employee.findOne({
        where: { employee_id: row["รหัสพนักงาน"] },
      });
      if (!employee) {
        failedRecords.push({ row, error: "ไม่พบรหัสพนักงานนี้ในระบบ" });
        errors.push({ row, error: "ไม่พบรหัสพนักงานนี้ในระบบ" });
        continue;
      }

      for (const csvTechStackName in techStackColumnMapping) {
        const techStackNameInDB = techStackColumnMapping[csvTechStackName];
        const levelName = row[csvTechStackName];

        // 2. หา techstack_id จากชื่อ techstack (name)
        const techStack = await TechStack.findOne({
          where: { name: techStackNameInDB },
        });
        if (!techStack) {
          failedRecords.push({
            row,
            error: `ไม่พบชื่อ Tech Stack: ${techStackNameInDB} ในระบบ`,
          });
          errors.push({
            row,
            error: `ไม่พบชื่อ Tech Stack: ${techStackNameInDB} ในระบบ`,
          });
          continue;
        }

        // 3. หา level_id จากชื่อ level (name)
        let levelId = null;
        if (levelName) {
          const level = await Level.findOne({ where: { name: levelName } });
          if (!level) {
            failedRecords.push({
              row,
              error: `ไม่พบชื่อ Level: ${levelName} ในระบบ`,
            });
            errors.push({ row, error: `ไม่พบชื่อ Level: ${levelName} ในระบบ` });
            continue;
          }
          levelId = level.level_id;
        }

        // 4. สร้างข้อมูลใหม่ใน employee_tech_skill
        const recordToCreate = {
          employee_id: employee.employee_id, // ใช้ employee_id (string) แทน id (int)
          techstack_id: techStack.techstack_id,
          level_id: levelId,
        };

        const [createdRecord, wasCreated] =
          await EmployeeTechSkill.findOrCreate({
            // ใช้ findOrCreate เพื่อป้องกันการบันทึกซ้ำ
            where: {
              employee_id: employee.employee_id, // ใช้ employee_id (string) แทน id (int)
              techstack_id: techStack.techstack_id,
            },
            defaults: recordToCreate,
          });

        if (wasCreated) {
          importedRecords.push(createdRecord);
        }
      }
    } catch (error) {
      failedRecords.push({ row, error: error.message });
      errors.push({ row, error: error.message });
    }
  }

  return {
    importedCount: importedRecords.length,
    failedCount: failedRecords.length,
    errors,
  };
}
