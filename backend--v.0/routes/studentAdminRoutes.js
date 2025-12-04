const express = require('express');
const { createStudent, getStudents,deleteStudent, updateStudent,patchStudent,getStudentByUsername } = require('../controllers/studentAdminController');
const router = express.Router();

router.post('/students', createStudent);
router.get('/get-students', getStudents);
router.delete('/delete-student/:rollno', deleteStudent);
router.put('/update-student/:rollno', updateStudent);
router.patch('/patch-student/:rollno', patchStudent);
router.get('/get-student-by-username/:username', getStudentByUsername);

module.exports = router;