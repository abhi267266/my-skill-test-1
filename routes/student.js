const express = require('express');
const router = express.Router();
const studentController = require('../controller/student_controller');

router.post('/create', studentController.create);



module.exports = router;