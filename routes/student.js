const express = require('express');
const router = express.Router();
const studentController = require('../controller/student_controller');

router.post('/create-or-update', studentController.createOrUpdateStudent);
router.get('/all', studentController.getAllStudents);
//student profile each ->
//update each student ->



module.exports = router;    