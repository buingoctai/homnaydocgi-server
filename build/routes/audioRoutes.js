"use strict";
var express = require('express');
var router = express.Router();
var audioController = require('./../controllers/audioController');
router.post('/getThumb', audioController.getThumb);
module.exports = router;
