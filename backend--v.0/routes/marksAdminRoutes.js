const express = require('express');
const router = express.Router();
const { createMarks,getMarks } = require('../controllers/marksAdminController');

router.post('/marks', createMarks);
router.get('/get-marks', getMarks);

module.exports = router;