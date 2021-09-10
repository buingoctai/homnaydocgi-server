const fs = require('fs');
const https = require('https');

import { file } from 'googleapis/build/src/apis/file';
import  {uploadFile}  from '../controllers/ggDriveController'; 
import constants from '../utils/constants';
const { ERROR_CODE } = constants;

const DOWNLOAD_FOLDER = 'resource';
interface DownloadedFile {
	fileName: string;
	filePath: string | undefined;
}
interface DownloadFile {
	fileName: string;
	url: string;
	extenstion: string;
}

const downloadFile = (params: DownloadFile): Promise<DownloadedFile> => {
	const { fileName, url, extenstion } = params;

	return new Promise((resolve, reject) => {
		https.get(url, (res: any) => {
			// Image will be stored at this path
			const path = `./${DOWNLOAD_FOLDER}/${fileName}.${extenstion}`;
			const fileStream = fs.createWriteStream(path);
			res.pipe(fileStream);

			fileStream.on('finish', () => {
				fileStream.close();
				resolve({ fileName, filePath: path });
			});
			fileStream.on('error', () => {
				reject({ fileName, filePath: undefined });
			});
		});
	});
};

const FPT_TEXT_2_SPEECH_HOST = 'https://api.fpt.ai/hmi/tts/v5';

const VALID_KEY_LIST = ['pFPrXZjFmdpeRQvxyrWCAlG2raO0mx4K', 'qb8Eh2CAuM0qnTGTgxYKkKYlbBSyZtFC', 'fKvki6PvfGv6njJTJ2Ije5qMOdP3vm8g'];
// const VALID_KEY_LIST = ['fKvki6PvfGv6njJTJ2Ije5qMOdP3vm8g'];

interface FptText2SpeechResponse {
	async: string;
	error: number;
	message: string;
	request_id: string;
}
const getRandomValidKeys = () => {
	return VALID_KEY_LIST[Math.floor(Math.random() * VALID_KEY_LIST.length)];
};
export const getAudioUrl = (text: string, reader: string): Promise<Array<string>> => {
	const request = require('superagent');
	const paragraphList: Array<string> = [];
	const audioUrlList: Array<string> = [];
	const sentenceList = text.split('.');

	let paragraph = sentenceList[0];

	if (sentenceList.length > 2) {
		for (let i = 1; i < sentenceList.length; i++) {
			if ((paragraph + sentenceList[i]).length > 5000) {
				paragraphList.push(paragraph);
				paragraph = '';
				i -= 1;
			} else {
				if (paragraph.length === 0) {
					paragraph += `${sentenceList[i]}.`;
				} else {
					paragraph += `. ${sentenceList[i]}`;
				}
				if (i === sentenceList.length - 1) {
					paragraphList.push(paragraph);
				}
			}
		}
	} else {
		paragraphList.push(text);
	}

	console.log('paragraphList', paragraphList);

	return new Promise((resolve, reject) => {
		for (let i = 0; i < paragraphList.length; i++) {
			request
				.post(FPT_TEXT_2_SPEECH_HOST)
				.send(paragraphList[i])
				.set('api-key', getRandomValidKeys())
				.set('voice', reader)
				.end((err: any, data: any) => {
					if (!err && data) {
						const parseData: FptText2SpeechResponse = JSON.parse(data.text);
						audioUrlList.push(parseData.async);
					}

					if (i === paragraphList.length - 1) {
						if (audioUrlList.length === 0) reject([]);
						else resolve(audioUrlList);
					}
				});
		}
	});
};

interface DownloadMulti {
	fileName: string;
	urlList: Array<string>;
	extenstion: string;
}
const downloadMulti = async (params: DownloadMulti): Promise<Array<DownloadedFile>> => {
	const { fileName, urlList, extenstion } = params;
	const list = urlList.map((url, idx) => {
		return { fileName: `${fileName} (${idx})`, url, extenstion };
	});

	return Promise.all(list.map((one) => downloadFile(one)));
};

interface MergeFiles {
	fileName: string;
	filePath: string | undefined;
}
const mergeMultiFile = async (files: Array<MergeFiles>, fileName: string, extenstion: string): Promise<DownloadedFile> => {
	const path = `./${DOWNLOAD_FOLDER}/${fileName}.${extenstion}`;
	const outStream = fs.createWriteStream(path);

	return new Promise((resolve, reject) => {
		for (let i = 0; i < files.length; i++) {
			const filePath = files[i].filePath;

			if (filePath) fs.createReadStream(files[i].filePath).pipe(outStream);
		}

		outStream.on('finish', () => {
			outStream.close();
			resolve({ fileName, filePath: path });
		});
		outStream.on('error', () => {
			reject({ fileName, filePath: undefined });
		});
	});
};

interface Text2Speech {
	fileName?: string;
	text?: string;
	reader?: string;
}

export const convertText2Speech = async (req: { body: object }, res: { statusCode: number; json: (data: any) => void }) => {
	const textInfo: Text2Speech = req.body || {};

	if (!textInfo.text || !textInfo.fileName) {
		res.statusCode = 400;
		res.json('Invalid params');
		return;
	}


	try {
		const audiolList: Array<string> = await getAudioUrl(textInfo.text, textInfo.reader ? textInfo.reader : 'banmai');
		const audioDownloaded: Array<DownloadedFile> = await downloadMulti({ fileName: textInfo.fileName, urlList: audiolList, extenstion: 'mp3' });
		const audio = await mergeMultiFile(audioDownloaded, textInfo.fileName, 'mp3');
        const uploaded = await uploadFile({
            filePath: audio.filePath,
            fileName: audio.fileName,
            fileType: 'audio/mp3',
            folderId: '1KBMCQuzPPo_00SlTCJbAFwcrtsa5XXGP',
        });
		res.json(audiolList);
	} catch (error) {
		res.statusCode = 500;
		res.json('Text2Speech has erros');
	}
};
