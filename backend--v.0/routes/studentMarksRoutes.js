const studentMarksController = require('../controllers/studentMarksController');
const express = require('express');
const router = express.Router();    
// Routes for Student Marks operations
// Create student marks
router.post('/add-marks', studentMarksController.addStudentMarks);
// Get all student marks
router.get('/get-marks', studentMarksController.getAllStudentMarks);    
// Get student marks by ID
router.get('/get-marks/:id', studentMarksController.getStudentMarksById);
// Update student marks by ID
router.put('/update-marks/:id', studentMarksController.updateStudentMarks);
// Delete student marks by ID
router.delete('/delete-marks/:id', studentMarksController.deleteStudentMarks);
module.exports = router;