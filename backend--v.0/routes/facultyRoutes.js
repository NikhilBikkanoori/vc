const facultyController = require('../controllers/facultyAdminController');
const express = require('express');
const router = express.Router();    
// Routes for Faculty operations

// Create a new faculty member
router.post('/add-fac', facultyController.addFaculty);
router.get('/get-fac', facultyController.getFaculty);
router.get('/get-fac/:id', facultyController.getFacultyById);
router.put('/update-fac/:id', facultyController.updateFaculty);
router.delete('/delete-fac/:id', facultyController.deleteFaculty);
module.exports = router;