"use strict";
var express = require('express');
var router = express.Router();
var userController = require('./../controllers/userController');
router.get('/example', userController.example);
router.post('/submitData', userController.submitUserData);
router.post('/authencation', userController.auhtencation);
router.post('/getProfile', userController.getProfile);
module.exports = router;
