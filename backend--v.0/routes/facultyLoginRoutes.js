const facultyLoginController = require('../controllers/facultyLoginController');
const express = require('express');
const router = express.Router();    
// Routes for Faculty login
router.post('/login', facultyLoginController.loginFaculty);

module.exports = router;