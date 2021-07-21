const express = require('express');
const router = express.Router();
const blogController = require('./../controllers/blogController');
const blogControllerTS = require('./../controllers-ts/blogController');

// Convert to TS
router.post('/mainPosts', blogControllerTS.getMainPosts);
router.post('/featuredPosts', blogControllerTS.getFeaturedPosts);
router.post('/allPost', blogControllerTS.getAllPost);

router.get('/allPost', blogController.getAllPostToCache);
router.post('/getDetailPost', blogController.getDetailPost);
router.get('/getDetailPost', blogController.getDetailPostToCache);
router.post('/getAllTopic', blogController.getAllTopic);
router.post('/getFollowTopic', blogController.getFollowTopic);
router.post('/searchArticles', blogController.searchArticles);
router.post('/getSavedPosts', blogController.getSavedPosts);

module.exports = router;
