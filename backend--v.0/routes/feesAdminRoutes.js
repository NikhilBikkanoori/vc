const express = require('express');
const { createFees }= require('../controllers/feesAdminContoller');
const router = express.Router();

router.post('/fees',createFees);

module.exports = router;