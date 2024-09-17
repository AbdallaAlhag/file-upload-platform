const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Post files to upload and create new file entries in Prisma DB
router.post('/upload', uploadController.fileUpload);

// Get files from server and download them
router.get('/download/:id', uploadController.fileDownload);

// rename file
router.patch('/rename/:id', uploadController.fileRename);

// share file
router.patch('/share/:id', uploadController.fileShare);

// star file
router.patch('/starred/:id', uploadController.fileStarred);

// copy file
router.post('/copy/:id', uploadController.fileCopy);

// delete file
router.delete('/delete/:id', uploadController.fileDelete);
module.exports = router;
