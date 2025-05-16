var express = require('express');
var router = express.Router();
const { createEmployee, getEmployeeById, getEmployeesByPagination, updateEmployee, deleteEmployee, getProjectEmployeePercentage, getTrendEmployeePercentage } = require('../controllers/employee.js');

router.get('/', getEmployeesByPagination);
router.get('/percent_project', getProjectEmployeePercentage);
router.get('/percent_trend', getTrendEmployeePercentage);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
