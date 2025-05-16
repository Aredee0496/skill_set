var express = require('express');
var router = express.Router();
const { getProjectEmployeePercentage, getTrendEmployeePercentage } = require('../controllers/employee_pj_tr_percent');

router.get('/project', getProjectEmployeePercentage);
router.get('/trend', getTrendEmployeePercentage);

module.exports = router;