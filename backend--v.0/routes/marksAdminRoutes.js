const express = require('express');
const router = express.Router();
const { createMarks,getMarks,getMarksByUsername } = require('../controllers/marksAdminController');

router.post('/marks', createMarks);
router.get('/get-marks', getMarks);
router.get('/get-marks-by-username/:Username', getMarksByUsername);

module.exports = router;