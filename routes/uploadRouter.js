const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Post files to upload and create new file entries in Prisma DB
router.post('/upload', uploadController.fileUpload);

// Add a new folder
router.post('/folder/:name', uploadController.createNewFolder);

// Get files from server and download them
router.post('/download/:id', uploadController.fileDownload);

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

router.patch('/move/:folder/:id', uploadController.fileMove);

router.patch('/restore/:id', uploadController.fileRestore);

router.get('/preview/:path', uploadController.filePreview);
module.exports = router;
