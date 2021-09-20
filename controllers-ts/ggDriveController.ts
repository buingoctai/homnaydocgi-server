import { startAuth } from './authen-ggDrive';
import { google } from 'googleapis';
import {Request,Response} from '../utils/response-params'
/**
 * @param  {} drive
 * @param  {string} whatQuery
 */

interface ResponseDrive {
	data: {
		files: Array<{id: string,name: string}>;
	};
}
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
				resolve({data: res.data.files, folderId});
			}
		});
	});
};

interface Folder {
	data : Array<{id: string,name: string}>,
	folderId?: string,
}

interface Collection {
	collectionId: string,
	collectionName: string,
}

interface CollectionParams {
	searchTxt?:string
}

export const getAllCollection = async (req : {body: CollectionParams}, res: Response) => {
	const { searchTxt = '' } = req.body;
	let collections: Array<Collection> = [];

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		const storage: Folder = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		for(let i =0;i<storage.data.length;i++) {
			const isValid = storage.data[i].name.toLowerCase().includes(searchTxt.toLowerCase());

			if(isValid) collections.push({collectionId: storage.data[i].id, collectionName: storage.data[i].name,});
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
	collectionIds: Array<string>,
	searchTxt?: '',

}

interface Audio {
	audioId: string,
	audioName:string,
	url:string,
}
const getAllItemMulti = (drive: any,folderIdlist: Array<string>):Promise<Array<Folder>> => {
	return Promise.all(folderIdlist.map((folderId) => {
		const query = "'idValue' in parents".replace('idValue', folderId);
		return getAllItem(drive,query,folderId);
	}));
}
export const getAllAudio =async (req : {body: AudioParams}, res: Response)  => {
	const { collectionIds = [], searchTxt ='' } = req.body;
	let allAudio: Array<Audio> = [];

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		
		if(collectionIds.length > 0) {
			const storageList: Array<Folder> = await getAllItemMulti(drive,collectionIds);

			for(let i =0;i<storageList.length;i++) {
				for(let j =0;j<storageList[i].data.length;j++) {
					const isValid = storageList[i].data[j].name.toLowerCase().includes(searchTxt.toLowerCase());

					if(isValid) allAudio.push({
						audioId:  storageList[i].data[j].id,
						audioName: storageList[i].data[j].name,
						url: `https://docs.google.com/uc?export=download&id=${storageList[i].data[j].id}`,
					});
				}
			}
			
			res.json({ data: allAudio, totalRecord: allAudio.length});
		} else {
			res.json({ data: [],totalRecord: 0});
		}

	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};