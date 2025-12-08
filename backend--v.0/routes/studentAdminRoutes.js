const express = require('express');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
    createStudent,
    uploadStudentCSV,
    getStudents,
    deleteStudent,
    updateStudent,
    patchStudent,
    getStudentByUsername
} = require('../controllers/studentAdminController');

const router = express.Router();

// Manual student insert
router.post('/students', createStudent);

// CSV bulk upload
router.post('/upload-students-csv', upload.single("file"), uploadStudentCSV);

// Get all students
router.get('/get-students', getStudents);

// Update & delete
router.delete('/delete-student/:rollno', deleteStudent);
router.put('/update-student/:rollno', updateStudent);
router.patch('/patch-student/:rollno', patchStudent);

// Get student by username
router.get('/get-student-by-username/:username', getStudentByUsername);

module.exports = router;