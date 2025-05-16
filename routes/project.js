var express = require('express');
var router = express.Router();
const { getAllProjects, updateProject, createProject, deleteProject } = require('../controllers/project.js');

router.get('/', getAllProjects);
router.put('/:id', updateProject);
router.post('/', createProject);
router.delete('/:id', deleteProject);

module.exports = router;
 