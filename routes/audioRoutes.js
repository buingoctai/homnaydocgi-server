const express = require('express');
const router = express.Router();

const audioController = require('./../controllers/audioController');

router.post('/getThumb', audioController.getThumb);

module.exports = router;
