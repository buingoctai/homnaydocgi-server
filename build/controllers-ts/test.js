"use strict";
var fs = require('fs');
var https = require('https');
// URL of the image
var url = 'https://file01.fpt.ai/text2speech-v5/long/2021-09-09/ngoclam.0.e5ef14e8bdaab58bbb692941477edbc7.mp3';
https.get(url, function (res) {
    // Image will be stored at this path
    var path = "./resource/test.mp3";
    var filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish', function () {
        filePath.close();
        console.log('Download Completed');
    });
});
