import fs from 'fs';
import { google } from 'googleapis';
import readline from 'readline';
import { HCommon } from '../utils/log-system';

let auth;
const TOKEN_PATH = './config/token.json';
const CREDENTIALS_PATH = './config/credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

/**
 * Từ một project, tạo credential
 * https://developers.google.com/drive/api/v3/quickstart/nodejs
 * https://console.cloud.google.com/home/dashboard?project=quickstart-1606563679883&authuser=1
 */
const startAuth = () => {
	return new Promise((resolve, reject) => {
		fs.readFile(CREDENTIALS_PATH, (err: any, content: any) => {
			if (err) return HCommon.logError(`[Authen GoogleDrive] -> Get error in reading existing credentials ${err}`);
			getAuth(JSON.parse(content), resolve, reject);
		});
	});
};
/**
 * Đọc token nếu có, nếu không có gen token
 * @param  {any} credentials
 * @param  {any} resolve
 * @param  {any} reject
 */
function getAuth(credentials: any, resolve: any, reject: any) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	fs.readFile(TOKEN_PATH, (err: any, token: any) => {
		if (err) {
			HCommon.logError(`[Authen GoogleDrive] -> [getAuth]: ${err}`);
			HCommon.logError(`[Authen GoogleDrive] -> Starting generate token`);
			return getAccessToken(oAuth2Client);
		}
		HCommon.logError(`[Authen GoogleDrive] -> [getAuth], token: ${token}`);
		oAuth2Client.setCredentials(JSON.parse(token));
		auth = oAuth2Client;
		resolve();
	});
}

function getAccessToken(oAuth2Client: any) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	HCommon.logError(`[Authen GoogleDrive] Authorize this app by visiting this url, authUrl: ${authUrl}`);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('[Authen GoogleDrive] Enter the code from that page here: ', (code: any) => {
		rl.close();
		oAuth2Client.getToken(code, (err: any, token: any) => {
			if (err) return console.error('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);

			HCommon.logError(`[Authen GoogleDrive] -> Starting save toke in a file`);
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
				if (err) return HCommon.logError(`[Authen GoogleDrive] -> have error in saving toke in a file`);
				HCommon.logError(`[Authen GoogleDrive] -> Toke is saved in ${TOKEN_PATH}`);
			});
			auth = undefined;
		});
	});
}
