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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var query = require('express').query;
var sql = require('mssql');
var constants = require('../utils/constants');
var GET_MAIN_ARTICLE = constants.GET_MAIN_ARTICLE, GET_FEATURED_ARTICLE = constants.GET_FEATURED_ARTICLE, GET_ARTICLE_AS_PAGE = constants.GET_ARTICLE_AS_PAGE, COUNT_TOTAL_ARTICLE = constants.COUNT_TOTAL_ARTICLE, FIND_DETAIL_POST = constants.FIND_DETAIL_POST, GET_FULL_DETAIL_POST = constants.GET_FULL_DETAIL_POST, FIND_ALL_TOPIC = constants.FIND_ALL_TOPIC, FIND_ARTICLE_AS_TOPIC = constants.FIND_ARTICLE_AS_TOPIC, SEARCH_ARTICLES = constants.SEARCH_ARTICLES, FIND_ARTICLES_BELONG_IN_LIST_ID = constants.FIND_ARTICLES_BELONG_IN_LIST_ID, ERROR_CODE = constants.ERROR_CODE;
exports.getMainPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request;
    return __generator(this, function (_a) {
        request = new sql.Request();
        request.query(GET_MAIN_ARTICLE, function (err, data) {
            if (err) {
                console.log('err', err);
                res.statusCode = 500;
                res.json(err);
            }
            console.log(data);
            var postData = data.recordset[0];
            res.json(postData);
        });
        return [2 /*return*/];
    });
}); };
exports.getFeaturedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repsonse, index, featuredLabels, temporyFunc;
    return __generator(this, function (_a) {
        repsonse = {};
        repsonse['data'] = [];
        index = 0;
        featuredLabels = req.body.featuredLabels;
        temporyFunc = new Promise(function (resolve, reject) {
            featuredLabels.forEach(function (item) {
                var request = new sql.Request();
                request.query(GET_FEATURED_ARTICLE.replace('LabelValue', item), function (err, data) {
                    if (err)
                        reject({
                            err: ERROR_CODE['500'],
                            statusCode: 500,
                        });
                    var postData = data.recordset[0];
                    if (!postData) {
                        reject({
                            err: ERROR_CODE['410'],
                            statusCode: 410,
                        });
                    }
                    repsonse['data'].push(postData);
                    index++;
                    if (index === featuredLabels.length) {
                        resolve(repsonse);
                    }
                });
            });
        });
        temporyFunc
            .then(function (data) { return res.json(data); })
            .catch(function (_a) {
            var err = _a.err, statusCode = _a.statusCode;
            res.statusCode = statusCode;
            res.json(err);
        });
        return [2 /*return*/];
    });
}); };
exports.getAllPostToCache = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paging, orderList, headArticle, found;
    return __generator(this, function (_a) {
        console.log('query', req.query);
        paging = { pageIndex: parseInt(req.query.pageIndex), pageSize: parseInt(req.query.pageSize) };
        orderList = { orderBy: req.query.orderBy, orderType: req.query.orderType };
        headArticle = req.query.headArticle;
        found = req.query.found;
        this.getAllPost({ body: { paging: paging, orderList: orderList, headArticle: headArticle, found: found } }, res);
        return [2 /*return*/];
    });
}); };
var getFullDetailPost = function (id) {
    return new Promise(function (resolve, reject) {
        var request = new sql.Request();
        request.query(GET_FULL_DETAIL_POST.replace('IdValue', id), function (err, data) {
            if (err) {
                reject(err);
            }
            var postData = data.recordset[0];
            console.log('postData', postData);
            resolve(postData);
        });
    });
};
var updateHeadArticle = function (list, id, pageIndex) {
    if (list === void 0) { list = []; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!id)
                return [2 /*return*/, { found: true }];
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                    var newList, headArticle, inPage, restList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                newList = [];
                                return [4 /*yield*/, getFullDetailPost(id)];
                            case 1:
                                headArticle = _a.sent();
                                inPage = list.filter(function (item, index) { return item.Id === id; }).length > 0;
                                if (inPage) {
                                    if (pageIndex === 1) {
                                        restList = list.filter(function (item, index) { return item.Id !== id; });
                                        newList = __spreadArray([headArticle], restList);
                                    }
                                    else {
                                        newList = list.filter(function (item, index) { return item.Id !== id; });
                                    }
                                    resolve({ newList: newList, found: true });
                                }
                                else {
                                    if (pageIndex === 1) {
                                        newList = __spreadArray([headArticle], list.slice(0, list.length - 1));
                                    }
                                    else {
                                        newList = list.slice(0, list.length - 1);
                                    }
                                    resolve({ newList: newList, found: false });
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
};
exports.getAllPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repsonse, _a, _b, pageIndex, pageSize, _c, orderType, orderBy, headArticle, found, start, callSearching;
    return __generator(this, function (_d) {
        repsonse = {};
        repsonse['data'] = [];
        repsonse['totalRecord'] = 0;
        _a = req.body, _b = _a.paging, pageIndex = _b.pageIndex, pageSize = _b.pageSize, _c = _a.orderList, orderType = _c.orderType, orderBy = _c.orderBy, headArticle = _a.headArticle, found = _a.found;
        start = null;
        callSearching = new Promise(function (resolve, reject) {
            var request = new sql.Request();
            request.query(COUNT_TOTAL_ARTICLE, function (err, data) {
                if (err)
                    reject({
                        err: ERROR_CODE['500'],
                        statusCode: 500,
                    });
                var item = data.recordset[0];
                if (pageIndex == -1) {
                    start = 0;
                    pageSize = item[''];
                }
                else {
                    start = pageSize * (pageIndex - 1);
                }
                if (!found && pageIndex !== 1 && pageIndex !== -1) {
                    start = start - 1;
                }
                request.query(GET_ARTICLE_AS_PAGE.replace('orderByValue', orderBy)
                    .replace('orderTypeValue', orderType)
                    .replace('startValue', start)
                    .replace('pageSizeValue', pageSize), function (err, data) { return __awaiter(void 0, void 0, void 0, function () {
                    var recordset, _a, newList, found, newRecordset;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (err)
                                    reject({
                                        err: ERROR_CODE['500'],
                                        statusCode: 500,
                                    });
                                recordset = data.recordset;
                                return [4 /*yield*/, updateHeadArticle(recordset, headArticle, pageIndex)];
                            case 1:
                                _a = _b.sent(), newList = _a.newList, found = _a.found;
                                newRecordset = newList || recordset;
                                resolve({
                                    data: newRecordset,
                                    totalRecord: item[''],
                                    found: found,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
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
exports.getDetailPostToCache = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        this.getDetailPost({ body: { id: req.query.id } }, res);
        return [2 /*return*/];
    });
}); };
exports.getDetailPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, request;
    return __generator(this, function (_a) {
        id = req.body.id;
        request = new sql.Request();
        request.query(FIND_DETAIL_POST.replace('IdValue', id), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
            }
            var postData = data.recordset[0];
            res.json(postData);
        });
        return [2 /*return*/];
    });
}); };
exports.getAllTopic = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, request;
    return __generator(this, function (_a) {
        response = [];
        request = new sql.Request();
        request.query(FIND_ALL_TOPIC, function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            recordset.map(function (item) {
                response.push(item.Topic);
            });
            res.json(response.filter(function (a, b) { return response.indexOf(a) === b; }));
        });
        return [2 /*return*/];
    });
}); };
exports.getFollowTopic = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var topicName, request;
    return __generator(this, function (_a) {
        topicName = req.body.topicName;
        request = new sql.Request();
        request.query(FIND_ARTICLE_AS_TOPIC.replace('LabelValue', topicName), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            res.json({ data: recordset });
        });
        return [2 /*return*/];
    });
}); };
exports.searchArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchTxt, request;
    return __generator(this, function (_a) {
        searchTxt = req.body.searchTxt;
        request = new sql.Request();
        request.query(SEARCH_ARTICLES.replace('titleValue', searchTxt).replace('authorValue', searchTxt).replace('contentValue', searchTxt), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            res.json({ data: recordset });
        });
        return [2 /*return*/];
    });
}); };
exports.getSavedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listId, stringListId, request;
    return __generator(this, function (_a) {
        listId = req.body.listId;
        stringListId = "'" + listId[0] + "'";
        for (i = 1; i < listId.length; i++) {
            stringListId = stringListId.concat(',', "'" + listId[i] + "'");
        }
        request = new sql.Request();
        request.query(FIND_ARTICLES_BELONG_IN_LIST_ID.replace('LIST_ID', stringListId), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            res.json({ data: recordset });
        });
        return [2 /*return*/];
    });
}); };
