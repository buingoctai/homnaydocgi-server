"use strict";
var express = require('express');
var router = express.Router();
var readNewController = require('./../controllers/readNewController');
router.post('/getAllArticle', readNewController.getAllArticle);
router.post('/createAudioArticle', readNewController.createAudioArticle);
router.post('/getAudioArticle', readNewController.getAudioArticle);
module.exports = router;
