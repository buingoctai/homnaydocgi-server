const fs = require('fs');
const https = require('https');

// URL of the image
const url = 'https://file01.fpt.ai/text2speech-v5/long/2021-09-09/ngoclam.0.e5ef14e8bdaab58bbb692941477edbc7.mp3';

https.get(url, (res) => {
	// Image will be stored at this path
	const path = `./resource/test.mp3`;
	const filePath = fs.createWriteStream(path);
	res.pipe(filePath);
	filePath.on('finish', () => {
		filePath.close();
		console.log('Download Completed');
	});
});
