const express = require("express");
const router = express.Router();
const readNewController = require("./../controllers/readNewController");

router.post("/getAllArticle", readNewController.getAllArticle);
router.post("/createAudioArticle", readNewController.createAudioArticle);
router.post("/getAudioArticle", readNewController.getAudioArticle);
module.exports = router;
