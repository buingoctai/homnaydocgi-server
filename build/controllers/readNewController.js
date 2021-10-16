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
var sql = require('mssql');
var constants = require('../utils/constants');
var FIND_ALL_ARTICLES_CRAWL = constants.FIND_ALL_ARTICLES_CRAWL, COUNT_TOTAL_ARTICLE_CRAWL = constants.COUNT_TOTAL_ARTICLE_CRAWL, ERROR_CODE = constants.ERROR_CODE, INSER_ARTICLE_CRAWL = constants.INSER_ARTICLE_CRAWL, FIND_AUDIO_ARTICLE_CRAWL = constants.FIND_AUDIO_ARTICLE_CRAWL;
exports.getAllArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repsonse, _a, _b, pageIndex, pageSize, _c, orderType, orderBy, callSearching;
    return __generator(this, function (_d) {
        repsonse = {};
        repsonse['data'] = [];
        repsonse['totalRecord'] = 0;
        _a = req.body, _b = _a.paging, pageIndex = _b.pageIndex, pageSize = _b.pageSize, _c = _a.orderList, orderType = _c.orderType, orderBy = _c.orderBy;
        callSearching = new Promise(function (resolve, reject) {
            var request = new sql.Request();
            request.query(COUNT_TOTAL_ARTICLE_CRAWL, function (err, data) {
                if (err)
                    reject({
                        err: ERROR_CODE['500'],
                        statusCode: 500,
                    });
                var item = data.recordset[0];
                request.query(FIND_ALL_ARTICLES_CRAWL.replace('orderByValue', orderBy)
                    .replace('orderTypeValue', orderType)
                    .replace('startValue', pageSize * (pageIndex - 1))
                    .replace('pageSizeValue', pageSize), function (err, data) {
                    if (err)
                        reject({
                            err: ERROR_CODE['500'],
                            statusCode: 5,
                        });
                    var recordset = data.recordset;
                    resolve({
                        data: recordset,
                        totalRecord: item[''],
                    });
                });
            });
        });
        callSearching
            .then(function (response) { return res.json(response); })
            .catch(function (_a) {
            var err = _a.err, statusCode = _a.statusCode;
            res.statusCode = statusCode;
            res.json(err);
        });
        return [2 /*return*/];
    });
}); };
exports.createAudioArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, _a, id, text, subContentList, contentGroup, audioGroup, subContent, i, _loop_1, i;
    return __generator(this, function (_b) {
        request = require('superagent');
        _a = req.body, id = _a.id, text = _a.text;
        subContentList = text.split('.');
        contentGroup = [];
        audioGroup = ['https://static.openfpt.vn/text2speech-v5/short/2020-06-17/banmai.0.47cfbfdc06230074ecec599773067e0d.mp3'];
        subContent = subContentList[0];
        if (subContent.length > 2) {
            for (i = 1; i < subContentList.length; i++) {
                if ((tempory = subContent + subContentList[i]).length > 5000) {
                    contentGroup.push(subContent);
                    subContent = '';
                    i -= 1;
                }
                else {
                    subContent += subContentList[i];
                    if (i === subContentList.length - 1) {
                        contentGroup.push(subContent);
                    }
                }
                tempory = '';
            }
        }
        else {
            contentGroup.push(text);
        }
        _loop_1 = function (i) {
            request
                .post('https://api.fpt.ai/hmi/tts/v5')
                .send(contentGroup[i])
                .set('api-key', 'B7WZOaKMXF3vlWKV2jRDfdr8733vpboU')
                .set('voice', 'banmai')
                .end(function (err, data) {
                console.log('data', data.text);
                audioGroup.push(JSON.parse(data.text).async);
                if (i === contentGroup.length - 1) {
                    var request_1 = new sql.Request();
                    request_1.query(INSER_ARTICLE_CRAWL.replace('ArticleIdValue', id).replace('AudioUrlValue', audioGroup.toString()), function (err) {
                        if (err) {
                            res.status(500).send();
                        }
                        res.json({
                            id: id,
                            audio: audioGroup,
                        });
                    });
                }
            });
        };
        for (i = 0; i < contentGroup.length; i++) {
            _loop_1(i);
        }
        return [2 /*return*/];
    });
}); };
exports.getAudioArticle = function (req, res) {
    var id = req.body.id;
    var request = new sql.Request();
    request.query(FIND_AUDIO_ARTICLE_CRAWL.replace('IdValue', id), function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.json(err);
        }
        var recordset = data.recordset;
        if (recordset.length === 0) {
            res.json({ id: id, audio: [] });
        }
        else {
            var audioData = recordset[0];
            res.json({
                id: id,
                audio: audioData.AudioUrl.split(','),
            });
        }
    });
};
