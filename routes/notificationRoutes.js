const express = require("express");
const router = express.Router();
const notificationController = require("./../controllers/notificationController");

router.post("/saveSubscription", notificationController.saveSubscription);
router.post(
  "/sendNotificationToAll",
  notificationController.sendNotificationToAll
);
router.post("/deleteSubscription", notificationController.deleteSubscription);

module.exports = router;
