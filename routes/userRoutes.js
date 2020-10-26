const express = require("express");
const router = express.Router();

const userController = require("./../controllers/userController");

router.get("/example", userController.example);
router.post("/submitData", userController.submitUserData);
router.post("/authencation", userController.auhtencation);
router.post("/getProfile", userController.getProfile);

module.exports = router;