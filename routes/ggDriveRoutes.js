const express = require('express');
const router = express.Router();

const ggDriveController = require('./../controllers/ggDriveController');

router.post('/getAllAudioBook', ggDriveController.getAllAudioBook);
router.post('/getAudioBook', ggDriveController.getAudioBook);

module.exports = router;
