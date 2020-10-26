const express = require("express");
const router = express.Router();

const adminController = require("./../controllers/adminController");

router.post("/submitPost", adminController.submitArticle);
router.post("/deletePosts", adminController.deletePosts);
router.post("/updatePosts", adminController.updatePosts);
module.exports = router;
