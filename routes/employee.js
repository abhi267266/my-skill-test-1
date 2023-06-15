const express = require('express');
const router = express.Router();
const passport = require('passport');
const employeeController = require('../controller/employee_controller')

router.get('/log-in', employeeController.login);
router.get('/sign-up', employeeController.signup);
router.post('/create', employeeController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/employee/sign-in'},
), employeeController.createSession);

//employee profile -> 


module.exports = router;