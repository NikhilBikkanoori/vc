// routes/facultyAdminRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  createFaculty,
  uploadFacultyCSV,
  getFaculties,
  getFacultyByUsername,
  updateFaculty,
  patchFaculty,
  deleteFaculty,
} = require('../controllers/facultyAdminController');

// Multer configuration for CSV upload
const upload = multer({ dest: 'uploads/' });

// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

// 1️⃣ Create a single faculty
router.post('/create-faculty', createFaculty);

// 2️⃣ Upload CSV for bulk insert
router.post('/upload-faculty-csv', upload.single('file'), uploadFacultyCSV);

// 3️⃣ Get all faculty members
router.get('/get-faculties', getFaculties);

// 4️⃣ Get a single faculty by username
router.get('/get-faculty/:username', getFacultyByUsername);

// 5️⃣ Update faculty (PUT)
router.put('/update-faculty/:username', updateFaculty);

// 6️⃣ Patch faculty (PATCH)
router.patch('/patch-faculty/:username', patchFaculty);

// 7️⃣ Delete faculty by username
router.delete('/delete-faculty/:username', deleteFaculty);

module.exports = router;