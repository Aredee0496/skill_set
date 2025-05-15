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

exports.createProject = async (req, res) => {
    try {
        const { name, backend, frontend, database, other } = req.body;
        const newProject = await Project.create({
            name,
            backend,
            frontend,
            database,
            other
        });
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: "Error creating project", error });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Project.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: "Project deleted successfully" });
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, backend, frontend, database, other } = req.body;
        const [updated] = await Project.update(
            { name, backend, frontend, database, other },
            { where: { id } }
        );
        if (updated) {
            const updatedProject = await Project.findByPk(id);
            res.status(200).json(updatedProject);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
};