const express = require('express');
const router = express.Router();

const ggDriveController = require('./../controllers/ggDriveController');
const ggDriveControllerTS = require('./../controllers-ts/ggDriveController');

// router.post('/getAllAudioBook', ggDriveController.getAllAudioBook);
router.post('/getAllCollection', ggDriveControllerTS.getAllCollection);
// router.post('/getAudioBook', ggDriveController.getAudioBook);
router.post('/getAllAudio', ggDriveControllerTS.getAllAudio);


router.post('/createMp3', ggDriveController.youtube2mp3);
router.post('/createFolder', ggDriveController.createFolder);
module.exports = router;
