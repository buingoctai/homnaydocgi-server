const express = require('express');
const router = express.Router();
const speechController = require('./../controllers-ts/speechController');

router.post('/text2speech', speechController.convertText2Speech);

module.exports = router;
