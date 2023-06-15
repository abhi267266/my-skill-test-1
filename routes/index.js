const express = require('express');
const router = express.Router();
const passport = require('passport');
const homeController = require('../controller/home_controller');

router.get('/',passport.checkAuthentication, homeController.home);
router.use('/employee', require('./employee'));
router.use('/student', require('./student'));

module.exports = router;