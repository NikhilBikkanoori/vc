const express = require('express');
const { parentLogin } = require('../controllers/parentLoginController');
const router = express.Router();

router.post('/login', parentLogin);

module.exports = router;