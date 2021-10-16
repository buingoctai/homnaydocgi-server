"use strict";
var express = require('express');
var router = express.Router();
var adminController = require('./../controllers/adminController');
router.post('/submitPost', adminController.submitArticle);
router.post('/deletePosts', adminController.deletePosts);
router.post('/updatePosts', adminController.updatePosts);
module.exports = router;
