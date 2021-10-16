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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendAudio = exports.youtube2mp3 = exports.uploadFile = exports.createFolder = exports.getAllAudio = exports.getAllCollection = exports.getAllItem = void 0;
var authen_ggDrive_1 = require("./authen-ggDrive");
var googleapis_1 = require("googleapis");
var log_system_1 = require("../utils/log-system");
var constants_1 = require("../utils/constants");
var utils_1 = require("../utils");
var error_code_1 = __importDefault(require("../utils/error-code"));
var fs = require('fs');
var sql = require('mssql');
var path = require('path');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var ffmpegPath = require('ffmpeg-static');
var GG_DRIVE_EXPORT = 'https://docs.google.com/uc?export=download&id=';
var GG_DRIVE_VERSION = 'v3';
var THUMB_YOUTUBE_DEFAULT = 'https://cdn.dribbble.com/users/63973/screenshots/4517275/media/583bc28c3c9e40dd06fd1aa0e5c76118.png?compress=1&resize=800x600';
var THUMB_YOUTUBE_VIDEO = 'https://img.youtube.com/vi/videoId/mqdefault.jpg';
var VALID_KEY_LIST = [
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
var getRandomImage = function () {
    return VALID_KEY_LIST[Math.floor(Math.random() * VALID_KEY_LIST.length)];
};
/** Get all sub folder in parent folder
 * @param  {any} drive
 * @param  {string} whatQuery
 * @param  {string} folderId?
 * @returns Promise
 */
var getAllItem = function (drive, whatQuery, folderId) {
    return new Promise(function (resolve, reject) {
        var query = {
            q: whatQuery,
            spaces: 'drive',
        };
        drive.files.list(query, function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                resolve({ data: res.data.files, folderId: folderId });
            }
        });
    });
};
exports.getAllItem = getAllItem;
/** Convert folders into new name: collection
 * @param  {{body:CollectionParams}} req
 * @param  {Response} res
 */
var getAllCollection = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, searchTxt, collections, auth, drive, storage, i, isValid, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.searchTxt, searchTxt = _a === void 0 ? '' : _a;
                collections = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, authen_ggDrive_1.startAuth()];
            case 2:
                auth = _b.sent();
                drive = googleapis_1.google.drive({
                    version: GG_DRIVE_VERSION,
                    auth: auth,
                });
                return [4 /*yield*/, exports.getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'")];
            case 3:
                storage = _b.sent();
                for (i = 0; i < storage.data.length; i++) {
                    isValid = storage.data[i].name.toLowerCase().includes(searchTxt.toLowerCase());
                    if (isValid)
                        collections.push({ collectionId: storage.data[i].id, collectionName: storage.data[i].name, thumb: getRandomImage() });
                }
                res.json({
                    data: collections,
                    totalRecord: collections.length,
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                res.statusCode = 500;
                res.json(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllCollection = getAllCollection;
/** Get all sub folder in parent folder list
 * @param  {any} drive
 * @param  {Array<string>} folderIdlist
 * @returns Promise
 */
var getAllItemMulti = function (drive, folderIdlist) {
    return Promise.all(folderIdlist.map(function (folderId) {
        var query = "'idValue' in parents".replace('idValue', folderId);
        return exports.getAllItem(drive, query, folderId);
    }));
};
var getThumbAudio = function () {
    var requestThumb = new sql.Request();
    var output = {};
    return new Promise(function (resolve, __) {
        requestThumb.query(constants_1.GET_THUMB, function (err, data) {
            if (err) {
                resolve({});
            }
            var videoIdList = data.recordset;
            for (var i = 0; i < videoIdList.length; i++) {
                var thumb = THUMB_YOUTUBE_VIDEO.replace('videoId', videoIdList[i].VideoId);
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
var getAllAudio = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, collectionIds, _c, searchTxt, allAudio, auth, drive, storageList, thumbList, i, j, isValid, thumb, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, _b = _a.collectionIds, collectionIds = _b === void 0 ? [] : _b, _c = _a.searchTxt, searchTxt = _c === void 0 ? '' : _c;
                allAudio = [];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                return [4 /*yield*/, authen_ggDrive_1.startAuth()];
            case 2:
                auth = _d.sent();
                drive = googleapis_1.google.drive({
                    version: GG_DRIVE_VERSION,
                    auth: auth,
                });
                if (!(collectionIds.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, getAllItemMulti(drive, collectionIds)];
            case 3:
                storageList = _d.sent();
                return [4 /*yield*/, getThumbAudio()];
            case 4:
                thumbList = _d.sent();
                for (i = 0; i < storageList.length; i++) {
                    for (j = 0; j < storageList[i].data.length; j++) {
                        isValid = storageList[i].data[j].name.toLowerCase().includes(searchTxt.toLowerCase());
                        if (isValid) {
                            thumb = thumbList[storageList[i].data[j].id] || THUMB_YOUTUBE_DEFAULT;
                            allAudio.push({
                                audioId: storageList[i].data[j].id,
                                audioName: storageList[i].data[j].name,
                                url: "" + GG_DRIVE_EXPORT + storageList[i].data[j].id,
                                thumb: thumb,
                            });
                        }
                    }
                }
                res.json({ data: allAudio, totalRecord: allAudio.length });
                return [3 /*break*/, 6];
            case 5:
                res.json({ data: [], totalRecord: 0 });
                _d.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_2 = _d.sent();
                res.statusCode = 500;
                res.json(err_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAllAudio = getAllAudio;
var createFolder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var collectionName, auth, drive, folders, existed, fileMetadata, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                collectionName = req.body.collectionName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, authen_ggDrive_1.startAuth()];
            case 2:
                auth = _a.sent();
                drive = googleapis_1.google.drive({
                    version: GG_DRIVE_VERSION,
                    auth: auth,
                });
                return [4 /*yield*/, exports.getAllItem(drive, "mimeType = 'application/vnd.google-apps.folder'")];
            case 3:
                folders = _a.sent();
                existed = folders.data.filter(function (item) { return item.name === collectionName; }).length > 0;
                if (existed) {
                    res.statusCode = 422;
                    res.json({
                        error_code: 2002,
                        message: error_code_1.default['2002'],
                    });
                }
                else {
                    fileMetadata = {
                        name: collectionName,
                        mimeType: 'application/vnd.google-apps.folder',
                    };
                    drive.files.create({
                        requestBody: fileMetadata,
                        fields: 'id',
                    }, function (err, file) {
                        if (err) {
                            log_system_1.HCommon.logError("[GG Drive] -> [createFolder] Error: " + err);
                            res.statusCode = 500;
                            res.json(err);
                        }
                        else {
                            res.json({
                                collectionId: file === null || file === void 0 ? void 0 : file.data.id,
                                collectionName: file === null || file === void 0 ? void 0 : file.data.name,
                            });
                        }
                    });
                }
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                res.statusCode = 500;
                res.json(err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createFolder = createFolder;
var checkExistedAudio = function (videoId) {
    var request = new sql.Request();
    return new Promise(function (resolve, reject) {
        request.query(constants_1.COUNT_AUDIO.replace('videoIdValue', videoId), function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[blogController] -> [checkExistedAudio]: " + err);
                reject(err);
            }
            var items = data.recordset[0];
            var total = Object.values(items)[0];
            resolve(total);
        });
    });
};
/** Download youtube video into local
 * @param  {string} url
 * @returns Promise
 */
var downloadVideo = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var _videoId, total, embedYtd, videoInfo, _relatedVideos_1, title, videoId_1, validTitle_1, filePath_1, videoObject, error_1;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _videoId = utils_1.getYoutubeId(url);
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, checkExistedAudio(_videoId)];
                        case 2:
                            total = _e.sent();
                            if (total > 0) {
                                reject({ error_code: '2004', message: error_code_1.default['2004'] });
                                return [2 /*return*/];
                            }
                            embedYtd = "https://youtu.be/" + _videoId;
                            return [4 /*yield*/, ytdl.getInfo(embedYtd)];
                        case 3:
                            videoInfo = _e.sent();
                            _relatedVideos_1 = videoInfo.related_videos.map(function (v) { return v.id; }).join(',');
                            title = (_b = (_a = videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.player_response) === null || _a === void 0 ? void 0 : _a.videoDetails) === null || _b === void 0 ? void 0 : _b.title;
                            videoId_1 = (_d = (_c = videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.player_response) === null || _c === void 0 ? void 0 : _c.videoDetails) === null || _d === void 0 ? void 0 : _d.videoId;
                            if (!title || !videoId_1)
                                reject({ error_code: '2001', message: error_code_1.default['2001'] });
                            validTitle_1 = title.replace(/[#$%^&*()''""|]/g, '-');
                            filePath_1 = path.join("resource/" + validTitle_1 + ".mp4");
                            videoObject = ytdl(embedYtd, {
                                filter: 'audioonly',
                            });
                            videoObject
                                .pipe(fs.createWriteStream(filePath_1))
                                .on('error', function (err) {
                                log_system_1.HCommon.logError("[GG Drive] -> [downloadVideo] Error: " + err);
                                reject({ error_code: '2003', message: error_code_1.default['2003'] });
                            })
                                .on('finish', function () {
                                resolve({
                                    filePath: filePath_1,
                                    folderPath: 'resource',
                                    title: validTitle_1 + ".mp3",
                                    videoId: videoId_1,
                                    relatedVideos: _relatedVideos_1,
                                });
                            });
                            return [3 /*break*/, 5];
                        case 4:
                            error_1 = _e.sent();
                            reject({ error_code: '2001', message: error_code_1.default['2001'] });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
/** Convert mp4 local to mp3 local
 * @param  {VideoLocal} source
 */
var convertMp4ToMp3 = function (source) {
    var filePathMp3 = path.join("resource/" + source.title + ".mp3");
    return new Promise(function (resolve, __) {
        ffmpeg(source.filePath)
            .setFfmpegPath(ffmpegPath)
            .format('mp3')
            .output(fs.createWriteStream(filePathMp3))
            .on('end', function () {
            fs.unlink(source.filePath, function (err) {
                if (err) {
                    log_system_1.HCommon.logError("[GG Drive] -> [convertMp4ToMp3] -> [Remove mp4 file] Error: " + err);
                    return;
                }
            });
            resolve(filePathMp3);
        })
            .run();
    });
};
var uploadFile = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, filePath, fileType, folderId, fileMetadata, media, auth, drive;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = params.fileName, filePath = params.filePath, fileType = params.fileType, folderId = params.folderId;
                fileMetadata = {
                    name: fileName,
                    parents: [folderId],
                };
                media = {
                    mimeType: fileType,
                    body: fs.createReadStream(filePath),
                };
                return [4 /*yield*/, authen_ggDrive_1.startAuth()];
            case 1:
                auth = _a.sent();
                drive = googleapis_1.google.drive({
                    version: GG_DRIVE_VERSION,
                    auth: auth,
                });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        drive.files.create({
                            requestBody: fileMetadata,
                            media: media,
                        }, function (err, file) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (err) {
                                    reject({ error: err.message });
                                }
                                else {
                                    fs.unlink(filePath, function (err) {
                                        if (err) {
                                            log_system_1.HCommon.logError("[GG Drive] -> [uploadFile] -> [Remove mp3 file] Error: " + err);
                                            return;
                                        }
                                    });
                                    resolve({
                                        fileId: file === null || file === void 0 ? void 0 : file.data.id,
                                        fileName: file === null || file === void 0 ? void 0 : file.data.name,
                                    });
                                }
                                return [2 /*return*/];
                            });
                        }); });
                    })];
        }
    });
}); };
exports.uploadFile = uploadFile;
var youtube2mp3 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, url, collectionId, source, filePath, fileOutput, output, request, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, url = _a.url, collectionId = _a.collectionId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, downloadVideo(url)];
            case 2:
                source = _b.sent();
                return [4 /*yield*/, convertMp4ToMp3(source)];
            case 3:
                filePath = _b.sent();
                return [4 /*yield*/, exports.uploadFile({
                        filePath: filePath,
                        fileName: source.title,
                        fileType: 'audio/mp3',
                        folderId: collectionId,
                    })];
            case 4:
                fileOutput = _b.sent();
                output = __assign(__assign({}, fileOutput), { videoId: source.videoId });
                request = new sql.Request();
                request.query(constants_1.INSERT_AUDIO.replace('fileIdValue', fileOutput.fileId)
                    .replace('folderIdValue', collectionId)
                    .replace('videoIdValue', source.videoId)
                    .replace('relatedVideosValue', source.relatedVideos));
                res.json(output);
                return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                res.statusCode = 422;
                res.json(err_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.youtube2mp3 = youtube2mp3;
var getRelatedVideos = function (audioId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var request = new sql.Request();
                request.query(constants_1.GET_RELATED_VIDEOS.replace('fileIdValue', audioId), function (err, data) {
                    if (err) {
                        log_system_1.HCommon.logError("[getRecommendAudio] -> [getRelatedVideos]: " + err);
                        reject(err);
                    }
                    var items = data.recordset[0];
                    resolve(items);
                });
            })];
    });
}); };
var getExistedVideos = function () {
    var request = new sql.Request();
    return new Promise(function (resolve, reject) {
        request.query(constants_1.GET_EXISTED_VIDEOS, function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[getRecommendAudio] -> [getExistedVideos]: " + err);
                reject(err);
            }
            var items = data.recordset;
            resolve(items.map(function (item) { return item.VideoId; }));
        });
    });
};
var getRecommendInfo = function (videoId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                var embedYtd, videoInfo, title, thumb, lengthSeconds, url, error_2;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 2, , 3]);
                            embedYtd = "https://youtu.be/" + videoId;
                            return [4 /*yield*/, ytdl.getInfo(embedYtd)];
                        case 1:
                            videoInfo = _e.sent();
                            title = (_b = (_a = videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.player_response) === null || _a === void 0 ? void 0 : _a.videoDetails) === null || _b === void 0 ? void 0 : _b.title;
                            thumb = THUMB_YOUTUBE_VIDEO.replace('videoId', videoId);
                            lengthSeconds = Number((_d = (_c = videoInfo === null || videoInfo === void 0 ? void 0 : videoInfo.player_response) === null || _c === void 0 ? void 0 : _c.videoDetails) === null || _d === void 0 ? void 0 : _d.lengthSeconds);
                            url = "https://youtu.be/" + videoId;
                            resolve({ url: url, title: title, thumb: thumb, lengthSeconds: lengthSeconds });
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _e.sent();
                            reject(null);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
var getTotalRecommnedInfo = function (videoIdList) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, i;
    return __generator(this, function (_a) {
        promises = [];
        for (i = 0; i < videoIdList.length; i++) {
            promises.push(getRecommendInfo(videoIdList[i]));
        }
        return [2 /*return*/, Promise.all(promises)];
    });
}); };
var getRecommendAudio = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, audioId, relatedVideos, existedList_1, relatedList, recommendList, recommendInfoList, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body.audioId, audioId = _a === void 0 ? '' : _a;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, getRelatedVideos(audioId)];
            case 2:
                relatedVideos = _b.sent();
                return [4 /*yield*/, getExistedVideos()];
            case 3:
                existedList_1 = _b.sent();
                relatedList = relatedVideos.RelatedVideos.split(',');
                recommendList = relatedList.filter(function (v) { return !existedList_1.includes(v); });
                return [4 /*yield*/, getTotalRecommnedInfo(recommendList.slice(2))];
            case 4:
                recommendInfoList = _b.sent();
                res.json({
                    audioId: audioId,
                    folderId: relatedVideos.FolderId,
                    recommendList: recommendInfoList,
                });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                res.statusCode = 500;
                res.json(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getRecommendAudio = getRecommendAudio;
