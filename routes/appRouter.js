const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

router.get('/', appController.getHome);

router.get('/search', appController.getSearch);

router.get('/filter', appController.getFilter);

router.get('/folder', appController.getFolder);

router.get('/recent', appController.getRecent);

router.get('/starred', appController.getStarred);

router.get('/recentlyDeleted', appController.getRecentlyDeleted);

router.get('/shared', appController.getShared);

router.get('/folder/:id', appController.getFolderFiles);

module.exports = router