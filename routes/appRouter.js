const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

router.get('/', appController.getHome);

router.get('/folder', appController.getFolder);

router.get('/recent', appController.getRecent);

router.get('/starred', appController.getStarred);

router.get('/recentlyDeleted', appController.getRecentlyDeleted);
module.exports = router