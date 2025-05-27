const express = require('express');
const router = express.Router();
const fileController = require('../controllers/blessblis');
const Authenication  = require('../middleware/Authenication');

router.post('/upload',Authenication.isAuthenticated,  fileController.FileSave);
router.get('/:id',Authenication.isAuthenticated  ,fileController.getFile);

module.exports = router;
