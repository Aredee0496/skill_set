var express = require('express');
var router = express.Router();
const { createEmployee, getEmployeeById, getEmployeesByPagination, updateEmployee, deleteEmployee } = require('../controllers/employee.js');

router.get('/', getEmployeesByPagination);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
