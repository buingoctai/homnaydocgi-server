"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertText2Speech = exports.getAudioUrl = void 0;
var fs = require('fs');
var retryFetch = require('../utils').retryFetch;
var log_system_1 = require("../utils/log-system");
var ggDriveController_1 = require("../controllers/ggDriveController");
/////////// Constants
var DOWNLOAD_FOLDER = 'resource';
var FPT_TEXT_2_SPEECH_HOST = 'https://api.fpt.ai/hmi/tts/v5';
var VALID_KEY_LIST = ['pFPrXZjFmdpeRQvxyrWCAlG2raO0mx4K', 'qb8Eh2CAuM0qnTGTgxYKkKYlbBSyZtFC', 'fKvki6PvfGv6njJTJ2Ije5qMOdP3vm8g'];
var FOLDER_TEXT_SPEECH = '1pm5_Tg7diUJkq4weYKoyMOMEHAmp4UaF';
/** Download file from remote url. Return file path in local
 * @param  {DownloadingFile} params
 * @returns Promise
 */
var downloadFile = function (params) {
    var fileName = params.fileName, url = params.url, extenstion = params.extenstion;
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var res, path_1, fileStream_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, retryFetch({ url: url, retries: 10, retryDelay: 5000 })];
                case 1:
                    res = _a.sent();
                    path_1 = "./" + DOWNLOAD_FOLDER + "/" + fileName + "." + extenstion;
                    fileStream_1 = fs.createWriteStream(path_1);
                    res.pipe(fileStream_1);
                    fileStream_1.on('finish', function () {
                        fileStream_1.close();
                        resolve({ fileName: fileName, filePath: path_1 });
                    });
                    fileStream_1.on('error', function () {
                        reject({ fileName: fileName, filePath: undefined });
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    reject({ fileName: fileName, filePath: undefined });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
var getRandomValidKeys = function () {
    return VALID_KEY_LIST[Math.floor(Math.random() * VALID_KEY_LIST.length)];
};
/** Get url audio from FPT Platform
 * @param  {string} text
 * @param  {string} reader
 * @returns Promise
 */
var getAudioUrl = function (text, reader) {
    var request = require('superagent');
    var paragraphList = [];
    var audioUrlList = [];
    var sentenceList = text.split('.');
    var paragraph = sentenceList[0];
    if (sentenceList.length > 2) {
        for (var i = 1; i < sentenceList.length; i++) {
            if ((paragraph + sentenceList[i]).length > 1000) {
                paragraphList.push(paragraph);
                paragraph = '';
                i -= 1;
            }
            else {
                if (paragraph.length === 0) {
                    paragraph += sentenceList[i] + ".";
                }
                else {
                    paragraph += ". " + sentenceList[i];
                }
                if (i === sentenceList.length - 1) {
                    paragraphList.push(paragraph);
                }
            }
        }
    }
    else {
        paragraphList.push(text);
    }
    return new Promise(function (resolve, reject) {
        var _loop_1 = function (i) {
            request
                .post(FPT_TEXT_2_SPEECH_HOST)
                .send(paragraphList[i])
                .set('api-key', getRandomValidKeys())
                .set('voice', reader)
                .end(function (err, data) {
                if (!err && data) {
                    var parseData = JSON.parse(data.text);
                    audioUrlList.push(parseData.async);
                }
                if (i === paragraphList.length - 1) {
                    if (audioUrlList.length === 0)
                        reject([]);
                    else
                        resolve(audioUrlList);
                }
            });
        };
        for (var i = 0; i < paragraphList.length; i++) {
            _loop_1(i);
        }
    });
};
exports.getAudioUrl = getAudioUrl;
/** Download files from url array
 * @param  {DownloadMulti} params
 * @returns Promise
 */
var downloadMulti = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, urlList, extenstion, list;
    return __generator(this, function (_a) {
        fileName = params.fileName, urlList = params.urlList, extenstion = params.extenstion;
        list = urlList.map(function (url, idx) {
            return { fileName: fileName + " (" + idx + ")", url: url, extenstion: extenstion };
        });
        return [2 /*return*/, Promise.all(list.map(function (one) { return downloadFile(one); }))];
    });
}); };
/** Delete total downloaded files after using
 * @param  {Array<MergeFiles>} files
 * @returns Promise
 */
var removeFiles = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var _loop_2 = function (i) {
                    var filePath = files[i].filePath;
                    fs.unlink(filePath, function (err) {
                        if (err) {
                            log_system_1.HCommon.logError("[removeFiles] remove files has errors: " + err);
                            reject(files[i]);
                        }
                    });
                };
                for (var i = 0; i < files.length; i++) {
                    _loop_2(i);
                }
                resolve('Remove files success!');
            })];
    });
}); };
/** Merge multi file in single file
 * @param  {Array<MergeFiles>} files
 * @param  {string} fileName
 * @param  {string} extenstion
 * @returns Promise
 */
var mergeMultiFile = function (files, fileName, extenstion) { return __awaiter(void 0, void 0, void 0, function () {
    var path, outStream;
    return __generator(this, function (_a) {
        path = "./" + DOWNLOAD_FOLDER + "/" + fileName + "." + extenstion;
        outStream = fs.createWriteStream(path);
        return [2 /*return*/, new Promise(function (resolve, reject) {
                for (var i = 0; i < files.length; i++) {
                    var filePath = files[i].filePath;
                    if (filePath) {
                        fs.createReadStream(filePath).pipe(outStream);
                    }
                }
                outStream.on('finish', function () {
                    outStream.close();
                    removeFiles(files);
                    resolve({ fileName: fileName, filePath: path });
                });
                outStream.on('error', function () {
                    reject({ fileName: fileName, filePath: undefined });
                });
            })];
    });
}); };
/** Convert text to speech urls
 * @param  {{body:object}} req
 * @param  {{statusCode:number;json:(data:any} res
 */
var convertText2Speech = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var textInfo, audiolList, audioDownloaded, audio, uploaded, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                textInfo = req.body || {};
                if (!textInfo.text || !textInfo.fileName) {
                    res.statusCode = 400;
                    res.json('Invalid params');
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, exports.getAudioUrl(textInfo.text, textInfo.reader ? textInfo.reader : 'banmai')];
            case 2:
                audiolList = _a.sent();
                return [4 /*yield*/, downloadMulti({ fileName: textInfo.fileName, urlList: audiolList, extenstion: 'mp3' })];
            case 3:
                audioDownloaded = _a.sent();
                return [4 /*yield*/, mergeMultiFile(audioDownloaded, textInfo.fileName, 'mp3')];
            case 4:
                audio = _a.sent();
                return [4 /*yield*/, ggDriveController_1.uploadFile({
                        filePath: audio.filePath,
                        fileName: audio.fileName,
                        fileType: 'audio/mp3',
                        folderId: FOLDER_TEXT_SPEECH,
                    })];
            case 5:
                uploaded = _a.sent();
                response = { id: uploaded.id, name: uploaded.name, url: "https://docs.google.com/uc?export=download&id=" + uploaded.id };
                res.json(response);
                return [3 /*break*/, 7];
            case 6:
                error_2 = _a.sent();
                res.statusCode = 500;
                res.json("Text2Speech has errors: " + error_2);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.convertText2Speech = convertText2Speech;
