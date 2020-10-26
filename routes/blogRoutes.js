const express = require("express");
const router = express.Router();
const blogController = require("./../controllers/blogController");

router.post("/mainPosts", blogController.getMainPosts);
router.post("/featuredPosts", blogController.getFeaturedPosts);
router.post("/allPost", blogController.getAllPost);
router.post("/getDetailPost", blogController.getDetailPost);
router.post("/getAllTopic", blogController.getAllTopic);
router.post("/getFollowTopic", blogController.getFollowTopic);
router.post("/searchArticles", blogController.searchArticles);
router.post("/getSavedPosts", blogController.getSavedPosts);

module.exports = router;
