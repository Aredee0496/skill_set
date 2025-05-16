var express = require('express');
var router = express.Router();
const {getEmployeeTechSkill } = require('../controllers/employee_tech_skill');

router.get('/', getEmployeeTechSkill);

module.exports = router;
