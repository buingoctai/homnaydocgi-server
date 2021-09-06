const express = require('express');
const router = express.Router();
const blogController = require('./../controllers/blogController');
const blogControllerTS = require('./../controllers-ts/blogController');

// Convert to TS
router.post('/mainPosts', blogControllerTS.getMainPosts);
router.post('/featuredPosts', blogControllerTS.getFeaturedPosts);
router.post('/allPost', blogControllerTS.getAllPost);
router.get('/allPost', blogControllerTS.getAllPostToCache);
router.post('/getDetailPost', blogControllerTS.getDetailPost);
router.get('/getDetailPost', blogControllerTS.getDetailPostToCache);
router.post('/searchArticles', blogControllerTS.searchArticles);

router.post('/getAllTopic', blogController.getAllTopic);
router.post('/getFollowTopic', blogController.getFollowTopic);
router.post('/getSavedPosts', blogController.getSavedPosts);

module.exports = router;
