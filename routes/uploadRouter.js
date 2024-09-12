const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Post files to upload and create new file entries in Prisma DB
router.post('/upload', uploadController.fileUpload);

// Get files from server and download them
router.get('/download/:id', uploadController.fileDownload);

module.exports = router;
