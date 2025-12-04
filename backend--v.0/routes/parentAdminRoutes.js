const express = require('express');
const {createParent}= require('../controllers/parentAdminController');
const router = express.Router();

router.post('/parents',createParent);

module.exports = router;