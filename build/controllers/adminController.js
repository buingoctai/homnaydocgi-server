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
// const newsql=require('mssql/msnodesqlv8');
var uuidv4 = require('uuid/v4');
var sendNotificationToAll = require('./notificationController').sendNotificationToAll;
var _a = require('../utils/constants'), INSERT_ARTICLE = _a.INSERT_ARTICLE, DELETE_ARTICLES = _a.DELETE_ARTICLES, UPDATE_ARTICLES = _a.UPDATE_ARTICLES;
exports.submitArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, author, title, content, topic, submitDate, imageUrl, newContent, newTitle, newImageUrl, subContentList, brief, id, request;
    return __generator(this, function (_b) {
        _a = req.body, author = _a.author, title = _a.title, content = _a.content, topic = _a.topic, submitDate = _a.submitDate, imageUrl = _a.imageUrl;
        newContent = content;
        newTitle = title.replace(/[#$%^&*()''""-]/g, ' ') || 'KHÔNG TIÊU ĐỀ';
        newImageUrl = imageUrl || 'https://homnaydocgi-storage.nyc3.digitaloceanspaces.com/placeholder.jpg';
        subContentList = newContent.split('.');
        brief = '';
        if (subContentList.length < 2) {
            brief = subContentList[0];
        }
        else {
            brief = subContentList[0].concat("." + subContentList[1]);
        }
        id = uuidv4();
        request = new sql.Request();
        request.query(INSERT_ARTICLE.replace('IdValue', id)
            .replace('AuthorValue', author)
            .replace('TitleValue', newTitle)
            .replace('ContentValue', newContent)
            .replace('TopicValue', topic)
            .replace('SubmitDateValue', submitDate)
            .replace('ImageValue', newImageUrl)
            .replace('BriefValue', brief), function (err) {
            if (err) {
                console.log('submitArticle err', err);
                res.statusCode = 500;
                res.json(err);
            }
            else {
                res.json();
                sendNotificationToAll({ body: { title: newTitle } });
            }
        });
        return [2 /*return*/];
    });
}); };
exports.deletePosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var items, request, stringList, i;
    return __generator(this, function (_a) {
        items = req.body.items;
        request = new sql.Request();
        stringList = "'" + items[0] + "'";
        for (i = 1; i < items.length; i++) {
            stringList = stringList.concat(',', "'" + items[i] + "'");
        }
        request.query(DELETE_ARTICLES.replace('LIST_ID', stringList), function (err) {
            if (err) {
                res.statusCode = 500;
                res.json(err);
            }
            res.json();
        });
        return [2 /*return*/];
    });
}); };
exports.updatePosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, items, data, request, author, title, content, topic, submitDate, imageUrl, subContentList, brief, updateFunc;
    return __generator(this, function (_b) {
        _a = req.body, items = _a.items, data = _a.data;
        request = new sql.Request();
        author = data.author, title = data.title, content = data.content, topic = data.topic, submitDate = data.submitDate, imageUrl = data.imageUrl;
        subContentList = content.split('.');
        brief = '';
        if (subContentList.length < 2) {
            brief = subContentList[0];
        }
        else {
            brief = subContentList[0].concat("." + subContentList[1]);
        }
        updateFunc = new Promise(function (resolve, reject) {
            for (var i = 0; i < items.length; i++) {
                request.query(UPDATE_ARTICLES.replace('AuthorValue', author)
                    .replace('TitleValue', title)
                    .replace('ContentValue', content)
                    .replace('TopicValue', topic)
                    .replace('SubmitDateValue', submitDate)
                    .replace('ImageUrlValue', imageUrl)
                    .replace('BriefValue', brief)
                    .replace('IdValue', "'" + items[i] + "'"), function (err) {
                    if (err) {
                        reject(err);
                    }
                });
                if (i === items.length - 1) {
                    resolve('');
                }
            }
        });
        updateFunc
            .then(function () { return res.json(); })
            .catch(function (err) {
            res.statusCode = 500;
            res.json(err);
        });
        return [2 /*return*/];
    });
}); };
