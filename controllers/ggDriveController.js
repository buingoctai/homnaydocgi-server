const fs = require('fs');
const sql = require('mssql');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { INSERT_AUDIO } = require('../utils/constants');

let auth;
const TOKEN_PATH = './config/token.json';
const CREDENTIALS_PATH = './config/credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const startAuth = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(CREDENTIALS_PATH, (err, content) => {
			if (err) return console.log('Error loading client secret file:', err);
			// Authorize a client with credentials, then call the Google Drive API.
			getAuth(JSON.parse(content), resolve, reject);
		});
	});
};

function getAuth(credentials, resolve, reject) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		console.log('token', token);
		if (err) return getAccessToken(oAuth2Client);
		oAuth2Client.setCredentials(JSON.parse(token));
		auth = oAuth2Client;
		resolve();
	});
}

function getAccessToken(oAuth2Client) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			auth = authoAuth2Client;
		});
	});
}

export const uploadFile = async ({ filePath, fileName, fileType, folderId }) => {
	var fileMetadata = {
		name: fileName,
		parents: [folderId],
	};

	const media = {
		mimeType: fileType,
		body: fs.createReadStream(filePath),
	};

	await startAuth();
	const drive = google.drive({
		version: 'v3',
		auth,
	});

	return new Promise((resolve, reject) => {
		drive.files.create(
			{
				resource: fileMetadata,
				media: media,
			},
			async (err, file) => {
				if (err) {
					reject({ error: err.message });
				} else {
					fs.unlink(filePath, (err) => {
						if (err) {
							console.error(err);
							return;
						}
					});
					console.log(`###### Log: uploadFile func, Upload file successfully`);
					resolve({
						id: file.data.id,
						name: file.data.name,
					});
				}
			}
		);
	});
};

const getAllItem = (drive, whatQuery) => {
	return new Promise((resolve, reject) => {
		const query = {
			q: whatQuery,
			spaces: 'drive',
		};

		drive.files.list(query, (err, res) => {
			if (err) {
				// Handle error
				reject(err);
			} else {
				resolve(res.data.files);
			}
		});
	});
};

const downloadFiles = (drive, id) => {
	return drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' }).then((res) => {
		return new Promise((resolve, reject) => {
			const filePath = './resource/test.mp3';
			console.log(`writing to ${filePath}`);
			const dest = fs.createWriteStream(filePath);
			let progress = 0;

			res.data
				.on('end', () => {
					console.log('Done downloading file.');
					resolve(filePath);
				})
				.on('error', (err) => {
					console.error('Error downloading file.');
					reject(err);
				})
				.on('data', (d) => {
					progress += d.length;
					if (process.stdout.isTTY) {
						process.stdout.clearLine();
						process.stdout.cursorTo(0);
						process.stdout.write(`Downloaded ${progress} bytes`);
					}
				})
				.pipe(dest);
		});
	});
};

exports.getAllAudioBook = async (req, res) => {
	const { searchTxt } = req.body;

	try {
		await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		const folders = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		const newFolders = folders.map((item) => {
			return {
				id: item.id,
				name: item.name,
			};
		});
		const filter = newFolders.filter((item) => item.name.includes(searchTxt));

		res.json({
			data: filter,
			totalRecord: filter.length,
		});
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};

exports.getAudioBook = async (req, res) => {
	const { id } = req.body;

	try {
		await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		const query = "'idValue' in parents".replace('idValue', id);
		console.log('query', query);
		const folders = await getAllItem(drive, query);
		const newFolders = folders.map((item) => {
			return {
				id: item.id,
				name: item.name,
				url: `https://docs.google.com/uc?export=download&id=${item.id}`,
			};
		});
		res.json({ data: newFolders, id });
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};
const downloadVideo = async (url) => {
	const {
		videoDetails: { title, videoId },
	} = await ytdl.getInfo(url);
	const videoInfor = await ytdl.getInfo(url);
	console.log('###### Log: downloadVideo func, videoInfor', videoInfor);
	// co the get cac video lien quan de de xuat
	const newTitle = title.replace(/[#$%^&*()''""|]/g, '-');
	// const filePath = path.join('resource', `${newTitle}.mp4`);
	const filePath = path.join(appRoot, `resource/${newTitle}.mp4`);
	console.log('###### Log: downloadVideo func, filePath', filePath);
	const videoObject = ytdl(url, {
		filter: 'audioonly',
	});

	return new Promise((resolve, reject) => {
		videoObject
			.pipe(fs.createWriteStream(filePath))
			.on('error', (err) => {
				reject(err);
			})
			.on('finish', () => {
				console.log(`###### Log: downloadVideo func, download ${title} successfully`);
				resolve({
					filePath,
					folderPath: 'resource',
					title: `${newTitle}.mp3`,
					videoId,
				});
			});
	});
};

const convertMp4ToMp3 = (source) => {
	// const newFilePath = path.join('resource', `${source.title}.mp3`);
	const newFilePath = path.join(appRoot, `resource/${source.title}.mp3`);
	console.log('###### Log: convertMp4ToMp3 func, newFilePath', newFilePath);

	return new Promise((resolve, reject) => {
		ffmpeg(source.filePath)
			.setFfmpegPath(ffmpegPath)
			.format('mp3')
			.output(fs.createWriteStream(newFilePath))
			.on('end', () => {
				fs.unlink(source.filePath, (err) => {
					if (err) {
						console.error('convertMp4ToMp3 ', err);
						return;
					}
				});
				console.log(`###### Log: convertMp4ToMp3 func, ConvertMp4ToMp3 successfully`);
				resolve(newFilePath);
			})
			.run();
	});
};
exports.youtube2mp3 = async (req, res) => {
	const { url, id } = req.body;

	try {
		const source = await downloadVideo(url);
		const filePath = await convertMp4ToMp3(source);

		const fileInfor = await uploadFile({
			filePath: filePath,
			fileName: source.title,
			fileType: 'audio/mp3',
			folderId: id,
		});
		const output = {
			...fileInfor,
			videoId: source.videoId,
		};
		const request = new sql.Request();

		request.query(INSERT_AUDIO.replace('idValue', fileInfor.id).replace('parentValue', id).replace('videoIdValue', source.videoId));
		res.json(output);
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};

exports.createFolder = async (req, res) => {
	const { name } = req.body;

	try {
		await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		const folders = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		const newFolders = folders.map((item) => {
			return {
				id: item.id,
				name: item.name,
			};
		});
		const isExistedFolder = newFolders.filter((item) => item.name === name).length > 0;

		if (isExistedFolder) {
			res.json({
				error: 'INVALID FOLDER NAME',
			});
		} else {
			const fileMetadata = {
				name,
				mimeType: 'application/vnd.google-apps.folder',
			};

			drive.files.create(
				{
					resource: fileMetadata,
				},
				function (err, file) {
					if (err) {
						res.statusCode = 500;
						res.json(err);
					} else {
						res.json({
							id: file.data.id,
							name: file.data.name,
						});
					}
				}
			);
		}
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};
