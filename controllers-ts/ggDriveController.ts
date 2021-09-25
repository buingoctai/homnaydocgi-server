import { startAuth } from './authen-ggDrive';
import { google } from 'googleapis';
import { Response } from '../utils/response-params';
import { HCommon } from '../utils/log-system';
import { INSERT_AUDIO, GET_THUMB } from '../utils/constants';
import ERROR_CODE from '../utils/error-code';

const fs = require('fs');
const sql = require('mssql');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

const GG_DRIVE_EXPORT = 'https://docs.google.com/uc?export=download&id=';
const GG_DRIVE_VERSION = 'v3';
const THUMB_YOUTUBE_DEFAULT =
	'https://cdn.dribbble.com/users/63973/screenshots/4517275/media/583bc28c3c9e40dd06fd1aa0e5c76118.png?compress=1&resize=800x600';
const THUMB_YOUTUBE_VIDEO = 'https://img.youtube.com/vi/videoId/mqdefault.jpg';

const VALID_KEY_LIST = [
	'https://photo-zmp3.zadn.vn/cover/d/0/d/7/d0d772a6c3e35b3e768d5c3ebf644ecd.jpg',
	'https://photo-zmp3.zadn.vn/cover/2/e/9/6/2e966bf47b1989fdff7149c7a1b0f25e.jpg',
	'https://photo-zmp3.zadn.vn/cover/e/6/8/0/e680570f74b3497c95d96f6ba6db7b07.jpg',
	'https://photo-zmp3.zadn.vn/cover/0/a/e/f/0aef849d584c7e995073617f53b9ac24.jpg',
	'https://photo-zmp3.zadn.vn/cover/0/f/d/1/0fd1da7445b21a752a1c4282b06f2cf0.jpg',
	'https://photo-zmp3.zadn.vn/cover/d/b/5/c/db5cf069b328c7858b2d9642cc6b4529.jpg',
	'https://photo-zmp3.zadn.vn/cover/9/5/1/b/951bb18f468ea711a81a0dd28a8797d4.jpg',
	'https://photo-zmp3.zadn.vn/cover/8/0/4/7/8047a5134646835763068f7439e17f2b.jpg',
	'https://photo-zmp3.zadn.vn/cover/e/3/d/4/e3d43659c6dc756f87f4e44220313f92.jpg',
	'https://photo-zmp3.zadn.vn/cover/1/c/c/8/1cc8ae9704ae8fb7e34487ce744083a9.jpg',
];
const getRandomImage = () => {
	return VALID_KEY_LIST[Math.floor(Math.random() * VALID_KEY_LIST.length)];
};

interface ResponseDrive {
	data: {
		files: Array<{ id: string; name: string }>;
	};
}
/** Get all sub folder in parent folder
 * @param  {any} drive
 * @param  {string} whatQuery
 * @param  {string} folderId?
 * @returns Promise
 */
export const getAllItem = (drive: any, whatQuery: string, folderId?: string): Promise<Folder> => {
	return new Promise((resolve, reject) => {
		const query = {
			q: whatQuery,
			spaces: 'drive',
		};

		drive.files.list(query, (err: any, res: ResponseDrive) => {
			if (err) {
				reject(err);
			} else {
				resolve({ data: res.data.files, folderId });
			}
		});
	});
};

interface Folder {
	data: Array<{ id: string; name: string }>;
	folderId?: string;
}

interface Collection {
	collectionId: string;
	collectionName: string;
	thumb: string;
}

interface CollectionParams {
	searchTxt?: string;
}
/** Convert folders into new name: collection
 * @param  {{body:CollectionParams}} req
 * @param  {Response} res
 */
export const getAllCollection = async (req: { body: CollectionParams }, res: Response) => {
	const { searchTxt = '' } = req.body;
	let collections: Array<Collection> = [];

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: GG_DRIVE_VERSION,
			auth,
		});
		const storage: Folder = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		for (let i = 0; i < storage.data.length; i++) {
			const isValid = storage.data[i].name.toLowerCase().includes(searchTxt.toLowerCase());

			if (isValid) collections.push({ collectionId: storage.data[i].id, collectionName: storage.data[i].name, thumb: getRandomImage() });
		}

		res.json({
			data: collections,
			totalRecord: collections.length,
		});
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};

interface AudioParams {
	collectionIds: Array<string>;
	searchTxt?: '';
}

interface Audio {
	audioId: string;
	audioName: string;
	url: string;
	thumb: string;
}
/** Get all sub folder in parent folder list
 * @param  {any} drive
 * @param  {Array<string>} folderIdlist
 * @returns Promise
 */
const getAllItemMulti = (drive: any, folderIdlist: Array<string>): Promise<Array<Folder>> => {
	return Promise.all(
		folderIdlist.map((folderId) => {
			const query = "'idValue' in parents".replace('idValue', folderId);
			return getAllItem(drive, query, folderId);
		})
	);
};

const getThumbAudio = (): Promise<{}> => {
	const requestThumb = new sql.Request();
	let output: object | any = {};

	return new Promise((resolve, __) => {
		requestThumb.query(GET_THUMB, (err: any, data: any) => {
			if (err) {
				resolve({});
			}
			const { recordset: videoIdList } = data;

			for (let i = 0; i < videoIdList.length; i++) {
				const thumb = THUMB_YOUTUBE_VIDEO.replace('videoId', videoIdList[i].VideoId);
				output[videoIdList[i].FileId] = thumb;
			}

			resolve(output);
		});
	});
};
/** Get all file in folder list, convert them into audio list
 * @param  {{body:AudioParams}} req
 * @param  {Response} res
 */
export const getAllAudio = async (req: { body: AudioParams }, res: Response) => {
	const { collectionIds = [], searchTxt = '' } = req.body;
	let allAudio: Array<Audio> = [];

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: GG_DRIVE_VERSION,
			auth,
		});

		if (collectionIds.length > 0) {
			const storageList: Array<Folder> = await getAllItemMulti(drive, collectionIds);
			const thumbList: object | any = await getThumbAudio();

			for (let i = 0; i < storageList.length; i++) {
				for (let j = 0; j < storageList[i].data.length; j++) {
					const isValid = storageList[i].data[j].name.toLowerCase().includes(searchTxt.toLowerCase());

					if (isValid) {
						const thumb = thumbList[storageList[i].data[j].id] || THUMB_YOUTUBE_DEFAULT;

						allAudio.push({
							audioId: storageList[i].data[j].id,
							audioName: storageList[i].data[j].name,
							url: `${GG_DRIVE_EXPORT}${storageList[i].data[j].id}`,
							thumb,
						});
					}
				}
			}

			res.json({ data: allAudio, totalRecord: allAudio.length });
		} else {
			res.json({ data: [], totalRecord: 0 });
		}
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};

interface FileMetadata {
	name: string;
	mimeType: string;
}

export const createFolder = async (req: { body: { collectionName: string } }, res: Response) => {
	const { collectionName } = req.body;

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: GG_DRIVE_VERSION,
			auth,
		});
		const folders: Folder = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		const existed = folders.data.filter((item) => item.name === collectionName).length > 0;

		if (existed) {
			res.statusCode = 422;
			res.json({
				error_code: 2002,
				message: ERROR_CODE['2002'],
			});
		} else {
			const fileMetadata: FileMetadata = {
				name: collectionName,
				mimeType: 'application/vnd.google-apps.folder',
			};

			drive.files.create(
				{
					requestBody: fileMetadata,
					fields: 'id',
				},
				function (err: any, file: any) {
					if (err) {
						HCommon.logError(`[GG Drive] -> [createFolder] Error: ${err}`);
						res.statusCode = 500;
						res.json(err);
					} else {
						res.json({
							collectionId: file?.data.id,
							collectionName: file?.data.name,
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

interface VideoLocal {
	filePath: string;
	folderPath: string;
	title: string;
	videoId: string;
}
/** Download youtube video into local
 * @param  {string} url
 * @returns Promise
 */
const downloadVideo = async (url: string): Promise<VideoLocal> => {
	return new Promise(async (resolve, reject) => {
		try {
			const videoInfo = await ytdl.getInfo(url);
			const title = videoInfo?.player_response?.videoDetails?.title;
			const videoId = videoInfo?.player_response?.videoDetails?.videoId;
			if (!title || !videoId) reject({ error_code: '2001', message: ERROR_CODE['2001'] });

			const validTitle = title.replace(/[#$%^&*()''""|]/g, '-');
			const filePath = path.join(`resource/${validTitle}.mp4`);
			const videoObject = ytdl(url, {
				filter: 'audioonly',
			});

			videoObject
				.pipe(fs.createWriteStream(filePath))
				.on('error', (err: any) => {
					HCommon.logError(`[GG Drive] -> [downloadVideo] Error: ${err}`);
					reject({ error_code: '2003', message: ERROR_CODE['2003'] });
				})
				.on('finish', () => {
					resolve({
						filePath,
						folderPath: 'resource',
						title: `${validTitle}.mp3`,
						videoId,
					});
				});
		} catch (error) {
			reject({ error_code: '2001', message: ERROR_CODE['2001'] });
		}
	});
};
/** Convert mp4 local to mp3 local
 * @param  {VideoLocal} source
 */
const convertMp4ToMp3 = (source: VideoLocal): Promise<string> => {
	const filePathMp3 = path.join(`resource/${source.title}.mp3`);

	return new Promise((resolve, __) => {
		ffmpeg(source.filePath)
			.setFfmpegPath(ffmpegPath)
			.format('mp3')
			.output(fs.createWriteStream(filePathMp3))
			.on('end', () => {
				fs.unlink(source.filePath, (err: any) => {
					if (err) {
						HCommon.logError(`[GG Drive] -> [convertMp4ToMp3] -> [Remove mp4 file] Error: ${err}`);
						return;
					}
				});
				resolve(filePathMp3);
			})
			.run();
	});
};

interface FileUpload {
	filePath: string;
	fileName: string;
	fileType: string;
	folderId: string;
}

interface FileOutput {
	fileId: string;
	fileName: string;
}

export const uploadFile = async (params: FileUpload): Promise<FileOutput> => {
	const { fileName, filePath, fileType, folderId } = params;
	const fileMetadata = {
		name: fileName,
		parents: [folderId],
	};

	const media = {
		mimeType: fileType,
		body: fs.createReadStream(filePath),
	};

	const auth: any = await startAuth();
	const drive = google.drive({
		version: GG_DRIVE_VERSION,
		auth,
	});

	return new Promise((resolve, reject) => {
		drive.files.create(
			{
				requestBody: fileMetadata,
				media: media,
			},
			async (err: any, file: any) => {
				if (err) {
					reject({ error: err.message });
				} else {
					fs.unlink(filePath, (err: any) => {
						if (err) {
							HCommon.logError(`[GG Drive] -> [uploadFile] -> [Remove mp3 file] Error: ${err}`);
							return;
						}
					});
					resolve({
						fileId: file?.data.id,
						fileName: file?.data.name,
					});
				}
			}
		);
	});
};

interface Mp3Output extends FileOutput {
	videoId: string;
}
export const youtube2mp3 = async (req: { body: { url: string; collectionId: string } }, res: Response) => {
	const { url, collectionId } = req.body;

	try {
		const source = await downloadVideo(url);
		const filePath = await convertMp4ToMp3(source);

		const fileOutput: FileOutput = await uploadFile({
			filePath: filePath,
			fileName: source.title,
			fileType: 'audio/mp3',
			folderId: collectionId,
		});
		const output: Mp3Output = {
			...fileOutput,
			videoId: source.videoId,
		};
		const request = new sql.Request();

		request.query(
			INSERT_AUDIO.replace('fileIdValue', fileOutput.fileId).replace('folderIdValue', collectionId).replace('videoIdValue', source.videoId)
		);
		res.json(output);
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};
