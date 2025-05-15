const { TechStack, Project } = require("../models");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    const techStacks = await TechStack.findAll({ attributes: ["techstack_id", "name"] });
    const techStackMap = Object.fromEntries(techStacks.map(ts => [ts.techstack_id, ts.name]));

    const getNames = (json) => {
      if (!json) return [];
      let arr = Array.isArray(json) ? json : (typeof json === "string" && json.trim() !== "" ? JSON.parse(json) : []);
      return arr.map(item => techStackMap[item.techstack_id]).filter(Boolean);
    };

    const formattedProjects = projects.map(project => ({
      Project: project.name,
      Backend: getNames(project.backend).join(", "),
      FrontEnd: getNames(project.frontend).join(", "),
      Database: getNames(project.database).join(", "),
      Other: getNames(project.other).join(", ")
    }));
    res.status(200).json(formattedProjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};
