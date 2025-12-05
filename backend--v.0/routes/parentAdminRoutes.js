const express = require('express');
const {createParent, getParents, deleteParent}= require('../controllers/parentAdminController');
const router = express.Router();

router.post('/parents',createParent);
router.get('/parents', getParents);
router.delete('/parents/:id', deleteParent);

module.exports = router;