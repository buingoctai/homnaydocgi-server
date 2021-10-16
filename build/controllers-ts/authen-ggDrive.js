"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAuth = void 0;
var fs_1 = __importDefault(require("fs"));
var googleapis_1 = require("googleapis");
var readline_1 = __importDefault(require("readline"));
var log_system_1 = require("../utils/log-system");
var auth;
var TOKEN_PATH = './config/token.json';
var CREDENTIALS_PATH = './config/credentials.json';
var SCOPES = ['https://www.googleapis.com/auth/drive'];
/**
 * Từ một project, tạo credential
 * https://developers.google.com/drive/api/v3/quickstart/nodejs
 * https://console.cloud.google.com/home/dashboard?project=quickstart-1606563679883&authuser=1
 */
var startAuth = function () {
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(CREDENTIALS_PATH, function (err, content) {
            if (err)
                return log_system_1.HCommon.logError("[Authen GoogleDrive] -> Get error in reading existing credentials " + err);
            getAuth(JSON.parse(content), resolve, reject);
        });
    });
};
exports.startAuth = startAuth;
/**
 * Đọc token nếu có, nếu không có gen token
 * @param  {any} credentials
 * @param  {any} resolve
 * @param  {any} reject
 */
function getAuth(credentials, resolve, reject) {
    var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
    var oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs_1.default.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            log_system_1.HCommon.logError("[Authen GoogleDrive] -> [getAuth]: " + err);
            log_system_1.HCommon.logError("[Authen GoogleDrive] -> Starting generate token");
            return getAccessToken(oAuth2Client);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        auth = oAuth2Client;
        resolve(auth);
    });
}
/** Gen token
 * @param  {any} oAuth2Client
 */
function getAccessToken(oAuth2Client) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    log_system_1.HCommon.logError("[Authen GoogleDrive] Authorize this app by visiting this url, authUrl: " + authUrl);
    var rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('[Authen GoogleDrive] Enter the code from that page here: ', function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            log_system_1.HCommon.logError("[Authen GoogleDrive] -> Starting save toke in a file");
            fs_1.default.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    return log_system_1.HCommon.logError("[Authen GoogleDrive] -> have error in saving toke in a file");
                log_system_1.HCommon.logError("[Authen GoogleDrive] -> Toke is saved in " + TOKEN_PATH);
            });
            auth = undefined;
        });
    });
}
