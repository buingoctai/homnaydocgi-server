import { startAuth } from './authen-ggDrive';
import { google } from 'googleapis';

/**
 * @param  {} drive
 * @param  {string} whatQuery
 */

interface Response {
	data: {
		files: Array<Collection>;
	};
}
export const getAllItem = (drive: any, whatQuery: string): Promise<Array<Collection>> => {
	return new Promise((resolve, reject) => {
		const query = {
			q: whatQuery,
			spaces: 'drive',
		};

		drive.files.list(query, (err: any, res: Response) => {
			if (err) {
				reject(err);
			} else {
				resolve(res.data.files);
			}
		});
	});
};

interface Collection {
	id: string;
	name: string;
}

export const getAllAudioBook = async (req : {body: {searchTxt:string}}, res:{ statusCode: number; json: (data: any) => void }) => {
	const { searchTxt: _searchTxt } = req.body;
    const searchTxt = _searchTxt || '';

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		const folders: Array<Collection> = await getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'");
		const newFolders = folders.map((item: { id: string; name: string }) => {
			return {
				id: item.id,
				name: item.name,
			};
		});
		const filter = newFolders.filter((item: Collection) => item.name.toLowerCase().includes(searchTxt.toLowerCase()));

		res.json({
			data: filter,
			totalRecord: filter.length,
		});
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};


export const getAudioBook =async (req : {body: {id:string}}, res:{ statusCode: number; json: (data: any) => void })  => {
	const { id = '' } = req.body;

	try {
		const auth: any = await startAuth();
		const drive = google.drive({
			version: 'v3',
			auth,
		});
		
		if(id) {
			const query = "'idValue' in parents".replace('idValue', id);
			const folders = await getAllItem(drive, query);
			const newFolders = folders.map((item) => {
				return {
					id: item.id,
					name: item.name,
					url: `https://docs.google.com/uc?export=download&id=${item.id}`,
				};
			});
			res.json({ data: newFolders,totalRecord: newFolders.length,id });
		} else {
			res.json({ data: [],totalRecord: 0, id });
		}
	} catch (err) {
		res.statusCode = 500;
		res.json(err);
	}
};