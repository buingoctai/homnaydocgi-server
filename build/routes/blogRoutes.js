"use strict";
var express = require('express');
var router = express.Router();
var blogController = require('./../controllers/blogController');
var blogControllerTS = require('./../controllers-ts/blogController');
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
