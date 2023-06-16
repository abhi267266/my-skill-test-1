const express = require('express');
const router = express.Router();
const passport = require('passport');
const employeeController = require('../controller/employee_controller')

router.get('/log-in', employeeController.login);
router.get('/sign-up', employeeController.signup);
router.post('/create', employeeController.create);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/employee/sign-up'},
), employeeController.createSession);

router.get('/profile/:id', employeeController.showProfile);
router.post('/profile/:id', employeeController.updateProfile);
router.get('/log-out', employeeController.destroySession)



module.exports = router;