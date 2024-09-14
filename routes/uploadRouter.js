const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Post files to upload and create new file entries in Prisma DB
router.post('/upload', uploadController.fileUpload);

// Get files from server and download them
router.get('/download/:id', uploadController.fileDownload);

// rename file
router.patch('/rename/:id', uploadController.fileRename);

// star file
router.patch('/starred/:id', uploadController.fileStarred);

// copy file
router.post('/copy/:id', uploadController.fileCopy);

module.exports = router;
