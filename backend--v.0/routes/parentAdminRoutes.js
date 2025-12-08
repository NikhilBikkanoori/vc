const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  createParent,
  uploadParentCSV,
  getParents,
  deleteParent,
  updateParent,
  patchParent,
  getParentByUsername
} = require('../controllers/parentAdminController');

const upload = multer({ dest: 'uploads/' });

router.post('/parents', createParent);
router.post('/upload-parents-csv', upload.single('file'), uploadParentCSV);
router.get('/get-parents', getParents);
router.delete('/delete-parent/:username', deleteParent);
router.put('/update-parent/:username', updateParent);
router.patch('/patch-parent/:username', patchParent);
router.get('/get-parent-by-username/:username', getParentByUsername);

module.exports = router;