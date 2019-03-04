const express = require('express');
const router = express.Router();
var multer = require('multer');
var uploads = multer();

const userController = require('../controllers/user');
const fileController = require('../controllers/file');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/files/:userId', fileController.getAllFiles);
router.post('/file/upload', uploads.single('file'), fileController.upload);
router.get('/file/download/', fileController.download);
router.delete('/file/delete/', fileController.deleteFile);

module.exports = router;
