"use strict";
var express = require('express');
var router = express.Router();
var speechController = require('./../controllers-ts/speechController');
router.post('/text2speech', speechController.convertText2Speech);
module.exports = router;
