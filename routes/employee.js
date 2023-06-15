const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employee_controller')

router.get('/log-in', employeeController.login);
router.get('/sign-up', employeeController.signup);
router.post('/create', employeeController.create);


module.exports = router;