const express = require('express');
const router = express.Router();

import { getAllCollection, getAllAudio, youtube2mp3, createFolder, getRecommendAudio } from './../controllers-ts/ggDriveController';

router.post('/getAllCollection', getAllCollection);
router.post('/getAllAudio', getAllAudio);
router.post('/createMp3', youtube2mp3);
router.post('/createFolder', createFolder);
router.post('/getRecommendAudio', getRecommendAudio);

module.exports = router;
