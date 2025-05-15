var express = require('express');
var router = express.Router();
const { getAllProjects } = require('../controllers/project.js');

router.get('/', getAllProjects);

module.exports = router;
