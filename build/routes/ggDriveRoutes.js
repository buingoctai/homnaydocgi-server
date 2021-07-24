"use strict";
var express = require('express');
var router = express.Router();
var ggDriveController = require('./../controllers/ggDriveController');
router.post('/getAllAudioBook', ggDriveController.getAllAudioBook);
router.post('/getAudioBook', ggDriveController.getAudioBook);
router.post('/createMp3', ggDriveController.youtube2mp3);
router.post('/createFolder', ggDriveController.createFolder);
module.exports = router;
