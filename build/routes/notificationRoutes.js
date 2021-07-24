"use strict";
var express = require('express');
var router = express.Router();
var notificationController = require('./../controllers/notificationController');
router.post('/saveSubscription', notificationController.saveSubscription);
router.post('/sendNotificationToAll', notificationController.sendNotificationToAll);
router.post('/deleteSubscription', notificationController.deleteSubscription);
module.exports = router;
