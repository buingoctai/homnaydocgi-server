const express = require("express");
const router = express.Router();

const botController = require("./../controllers/botController");

router.get("", botController.handleVerify);
router.post("", botController.handleMsg);
router.post("/sendMsg", botController.sendMessage);
module.exports = router;
