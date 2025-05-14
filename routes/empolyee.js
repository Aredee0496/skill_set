var express = require('express');
var router = express.Router();
const { getAllEmployees } = require('../controllers/employee.controller.js');

/* GET users listing. */
router.get('/', getAllEmployees);

module.exports = router;
