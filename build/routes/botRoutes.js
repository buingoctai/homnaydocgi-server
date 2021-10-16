"use strict";
var express = require('express');
var router = express.Router();
var botController = require('./../controllers/botController');
router.get('', botController.handleVerify);
router.post('', botController.handleMsg);
router.post('/sendMsg', botController.sendMessage);
module.exports = router;
