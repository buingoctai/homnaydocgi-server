"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs = require('fs');
var sql = require('mssql');
var path = require('path');
var readline = require('readline');
var google = require('googleapis').google;
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var ffmpegPath = require('ffmpeg-static');
var sanitize = require('sanitize-filename');
var INSERT_AUDIO = require('../utils/constants').INSERT_AUDIO;
var auth;
var TOKEN_PATH = './config/token.json';
var SCOPES = ['https://www.googleapis.com/auth/drive'];
var startAuth = function () {
    return new Promise(function (resolve, reject) {
        fs.readFile('./config/credentials.json', function (err, content) {
            if (err)
                return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            getAuth(JSON.parse(content), resolve, reject);
        });
    });
};
function getAuth(credentials, resolve, reject) {
    var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
    var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        console.log('token', token);
        if (err)
            return getAccessToken(oAuth2Client);
        oAuth2Client.setCredentials(JSON.parse(token));
        auth = oAuth2Client;
        resolve();
    });
}
function getAccessToken(oAuth2Client) {
    var authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oAuth2Client.getToken(code, function (err, token) {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            auth = authoAuth2Client;
        });
    });
}
var uploadFile = function (_a) {
    var filePath = _a.filePath, fileName = _a.fileName, fileType = _a.fileType, folderId = _a.folderId;
    return __awaiter(void 0, void 0, void 0, function () {
        var fileMetadata, media, drive;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileMetadata = {
                        name: fileName,
                        parents: [folderId],
                    };
                    media = {
                        mimeType: fileType,
                        body: fs.createReadStream(filePath),
                    };
                    return [4 /*yield*/, startAuth()];
                case 1:
                    _b.sent();
                    drive = google.drive({
                        version: 'v3',
                        auth: auth,
                    });
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            drive.files.create({
                                resource: fileMetadata,
                                media: media,
                            }, function (err, file) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (err) {
                                        reject({ error: err.message });
                                    }
                                    else {
                                        fs.unlink(filePath, function (err) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
                                        });
                                        console.log("###### Log: uploadFile func, Upload file successfully");
                                        resolve({
                                            id: file.data.id,
                                            name: file.data.name,
                                        });
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        })];
            }
        });
    });
};
var getAllItem = function (drive, whatQuery) {
    return new Promise(function (resolve, reject) {
        var query = {
            q: whatQuery,
            spaces: 'drive',
        };
        drive.files.list(query, function (err, res) {
            if (err) {
                // Handle error
                reject(err);
            }
            else {
                resolve(res.data.files);
            }
        });
    });
};
var downloadFiles = function (drive, id) {
    return drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' }).then(function (res) {
        return new Promise(function (resolve, reject) {
            var filePath = './resource/test.mp3';
            console.log("writing to " + filePath);
            var dest = fs.createWriteStream(filePath);
            var progress = 0;
            res.data
                .on('end', function () {
                console.log('Done downloading file.');
                resolve(filePath);
            })
                .on('error', function (err) {
                console.error('Error downloading file.');
                reject(err);
            })
                .on('data', function (d) {
                progress += d.length;
                if (process.stdout.isTTY) {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write("Downloaded " + progress + " bytes");
                }
            })
                .pipe(dest);
        });
    });
};
exports.getAllAudioBook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchTxt, drive, folders, newFolders, filter, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchTxt = req.body.searchTxt;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, startAuth()];
            case 2:
                _a.sent();
                drive = google.drive({
                    version: 'v3',
                    auth: auth,
                });
                return [4 /*yield*/, getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'")];
            case 3:
                folders = _a.sent();
                newFolders = folders.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                });
                filter = newFolders.filter(function (item) { return item.name.includes(searchTxt); });
                res.json({
                    data: filter,
                    totalRecord: filter.length,
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.statusCode = 500;
                res.json(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAudioBook = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, drive, query, folders, newFolders, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, startAuth()];
            case 2:
                _a.sent();
                drive = google.drive({
                    version: 'v3',
                    auth: auth,
                });
                query = "'idValue' in parents".replace('idValue', id);
                console.log('query', query);
                return [4 /*yield*/, getAllItem(drive, query)];
            case 3:
                folders = _a.sent();
                newFolders = folders.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                        url: "https://docs.google.com/uc?export=download&id=" + item.id,
                    };
                });
                res.json({ data: newFolders, id: id });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                res.statusCode = 500;
                res.json(err_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var downloadVideo = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, videoId, videoInfor, newTitle, filePath, videoObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ytdl.getInfo(url)];
            case 1:
                _a = (_b.sent()).videoDetails, title = _a.title, videoId = _a.videoId;
                return [4 /*yield*/, ytdl.getInfo(url)];
            case 2:
                videoInfor = _b.sent();
                console.log('###### Log: downloadVideo func, videoInfor', videoInfor);
                newTitle = title.replace(/[#$%^&*()''""|]/g, '-');
                filePath = path.join(appRoot, "resource/" + newTitle + ".mp4");
                console.log('###### Log: downloadVideo func, filePath', filePath);
                videoObject = ytdl(url, {
                    filter: 'audioonly',
                });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        videoObject
                            .pipe(fs.createWriteStream(filePath))
                            .on('error', function (err) {
                            reject(err);
                        })
                            .on('finish', function () {
                            console.log("###### Log: downloadVideo func, download " + title + " successfully");
                            resolve({
                                filePath: filePath,
                                folderPath: 'resource',
                                title: newTitle + ".mp3",
                                videoId: videoId,
                            });
                        });
                    })];
        }
    });
}); };
var convertMp4ToMp3 = function (source) {
    // const newFilePath = path.join('resource', `${source.title}.mp3`);
    var newFilePath = path.join(appRoot, "resource/" + source.title + ".mp3");
    console.log('###### Log: convertMp4ToMp3 func, newFilePath', newFilePath);
    return new Promise(function (resolve, reject) {
        ffmpeg(source.filePath)
            .setFfmpegPath(ffmpegPath)
            .format('mp3')
            .output(fs.createWriteStream(newFilePath))
            .on('end', function () {
            fs.unlink(source.filePath, function (err) {
                if (err) {
                    console.error('convertMp4ToMp3 ', err);
                    return;
                }
            });
            console.log("###### Log: convertMp4ToMp3 func, ConvertMp4ToMp3 successfully");
            resolve(newFilePath);
        })
            .run();
    });
};
exports.youtube2mp3 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, url, id, source, filePath, fileInfor, output, request, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, url = _a.url, id = _a.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, downloadVideo(url)];
            case 2:
                source = _b.sent();
                return [4 /*yield*/, convertMp4ToMp3(source)];
            case 3:
                filePath = _b.sent();
                return [4 /*yield*/, uploadFile({
                        filePath: filePath,
                        fileName: source.title,
                        fileType: 'audio/mp3',
                        folderId: id,
                    })];
            case 4:
                fileInfor = _b.sent();
                output = __assign(__assign({}, fileInfor), { videoId: source.videoId });
                request = new sql.Request();
                request.query(INSERT_AUDIO.replace('idValue', fileInfor.id).replace('parentValue', id).replace('videoIdValue', source.videoId));
                res.json(output);
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                res.statusCode = 500;
                res.json(err_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createFolder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, drive, folders, newFolders, isExistedFolder, fileMetadata, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.body.name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, startAuth()];
            case 2:
                _a.sent();
                drive = google.drive({
                    version: 'v3',
                    auth: auth,
                });
                return [4 /*yield*/, getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'")];
            case 3:
                folders = _a.sent();
                newFolders = folders.map(function (item) {
                    return {
                        id: item.id,
                        name: item.name,
                    };
                });
                isExistedFolder = newFolders.filter(function (item) { return item.name === name; }).length > 0;
                if (isExistedFolder) {
                    res.json({
                        error: 'INVALID FOLDER NAME',
                    });
                }
                else {
                    fileMetadata = {
                        name: name,
                        mimeType: 'application/vnd.google-apps.folder',
                    };
                    drive.files.create({
                        resource: fileMetadata,
                    }, function (err, file) {
                        if (err) {
                            res.statusCode = 500;
                            res.json(err);
                        }
                        else {
                            res.json({
                                id: file.data.id,
                                name: file.data.name,
                            });
                        }
                    });
                }
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                res.statusCode = 500;
                res.json(err_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var check = 'aaaaa';
