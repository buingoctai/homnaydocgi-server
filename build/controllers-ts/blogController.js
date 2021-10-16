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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuthor = exports.getAllTopic = exports.searchArticles = exports.getDetailPostToCache = exports.getDetailPost = exports.getAllPostToCache = exports.getAllPost = exports.getFeaturedPosts = exports.getMainPosts = void 0;
var sql = require('mssql');
var constants_1 = __importDefault(require("../utils/constants"));
var log_system_1 = require("../utils/log-system");
var response_params_1 = require("../utils/response-params");
var GET_MAIN_ARTICLE = constants_1.default.GET_MAIN_ARTICLE, GET_FEATURED_ARTICLE = constants_1.default.GET_FEATURED_ARTICLE, GET_ARTICLE_AS_PAGE = constants_1.default.GET_ARTICLE_AS_PAGE, GET_ARTICLE_AS_PAGE_AUTHOR = constants_1.default.GET_ARTICLE_AS_PAGE_AUTHOR, GET_ARTICLE_AS_PAGE_TOPIC = constants_1.default.GET_ARTICLE_AS_PAGE_TOPIC, GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC = constants_1.default.GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC, COUNT_TOTAL_ARTICLE = constants_1.default.COUNT_TOTAL_ARTICLE, COUNT_TOTAL_ARTICLE_TOPIC = constants_1.default.COUNT_TOTAL_ARTICLE_TOPIC, COUNT_TOTAL_ARTICLE_AUTHOR = constants_1.default.COUNT_TOTAL_ARTICLE_AUTHOR, COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC = constants_1.default.COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC, GET_DETAIL_POST = constants_1.default.GET_DETAIL_POST, GET_FULL_DETAIL_POST = constants_1.default.GET_FULL_DETAIL_POST, SEARCH_ARTICLES = constants_1.default.SEARCH_ARTICLES, GET_ALL_TOPIC = constants_1.default.GET_ALL_TOPIC, ERROR_CODE = constants_1.default.ERROR_CODE, GET_ALL_AUTHOR = constants_1.default.GET_ALL_AUTHOR;
var getMainPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request;
    return __generator(this, function (_a) {
        request = new sql.Request();
        request.query(GET_MAIN_ARTICLE, function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[blogController] -> [getMainPosts]: " + err);
                res.statusCode = 500;
                res.json(err);
            }
            var postData = data.recordset[0];
            res.json(postData);
        });
        return [2 /*return*/];
    });
}); };
exports.getMainPosts = getMainPosts;
var getFeaturedPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repsonse, index, featuredLabels, executeQuery;
    return __generator(this, function (_a) {
        repsonse = new response_params_1.RepsonseFeaturedPost([]);
        index = 0;
        featuredLabels = req.body.featuredLabels;
        executeQuery = new Promise(function (resolve, reject) {
            featuredLabels.forEach(function (item) {
                var request = new sql.Request();
                request.query(GET_FEATURED_ARTICLE.replace('LabelValue', item), function (err, data) {
                    if (err) {
                        log_system_1.HCommon.logError("[blogController] -> [getFeaturedPosts] -> [query]: " + err);
                        reject({
                            err: ERROR_CODE['500'],
                            statusCode: 500,
                        });
                    }
                    var postData = data.recordset[0];
                    if (!postData) {
                        reject({
                            err: ERROR_CODE['410'],
                            statusCode: 410,
                        });
                    }
                    repsonse['data'].push(postData);
                    index++;
                    if (index === featuredLabels.length)
                        resolve(repsonse);
                });
            });
        });
        executeQuery
            .then(function (data) { return res.json(data); })
            .catch(function (_a) {
            var err = _a.err, statusCode = _a.statusCode;
            log_system_1.HCommon.logError("[blogController] -> [getFeaturedPosts] -> [response]: " + err);
            res.statusCode = statusCode;
            res.json(err);
        });
        return [2 /*return*/];
    });
}); };
exports.getFeaturedPosts = getFeaturedPosts;
var getFullDetailPost = function (id) {
    return new Promise(function (resolve, reject) {
        var request = new sql.Request();
        request.query(GET_FULL_DETAIL_POST.replace('IdValue', id), function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[getFullDetailPost] -> [query]: " + err);
                reject(err);
            }
            var postData = data.recordset[0];
            resolve(postData);
        });
    });
};
var updateHeadArticle = function (list, id, pageIndex) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!id)
            return [2 /*return*/, { newList: null, found: true }];
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
}); };
var getAllPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, _a, pageIndex, _b, orderType, orderBy, headArticle, found, _c, filter, start, pageSize, executeQuery;
    return __generator(this, function (_d) {
        response = new response_params_1.RepsonseAllPost([], 0, false);
        _a = req.body, pageIndex = _a.paging.pageIndex, _b = _a.orderList, orderType = _b.orderType, orderBy = _b.orderBy, headArticle = _a.headArticle, found = _a.found, _c = _a.filter, filter = _c === void 0 ? { topic: [], author: [] } : _c;
        start = null;
        pageSize = req.body.paging.pageSize;
        executeQuery = new Promise(function (resolve, reject) {
            var request = new sql.Request();
            var topicStr = '';
            var authorStr = '';
            var queryAsPage = '';
            var queryTotal = '';
            if ((filter === null || filter === void 0 ? void 0 : filter.topic) && (filter === null || filter === void 0 ? void 0 : filter.topic.length) > 0) {
                if ((filter === null || filter === void 0 ? void 0 : filter.topic.length) === 1) {
                    topicStr = "'" + (filter === null || filter === void 0 ? void 0 : filter.topic[0]) + "'";
                }
                else {
                    topicStr = "'" + (filter === null || filter === void 0 ? void 0 : filter.topic[0]) + "'";
                    for (var i = 1; i < (filter === null || filter === void 0 ? void 0 : filter.topic.length); i++) {
                        topicStr += ',' + ("'" + (filter === null || filter === void 0 ? void 0 : filter.topic[i]) + "'");
                    }
                }
            }
            if ((filter === null || filter === void 0 ? void 0 : filter.author) && (filter === null || filter === void 0 ? void 0 : filter.author.length) > 0) {
                if ((filter === null || filter === void 0 ? void 0 : filter.author.length) === 1) {
                    authorStr = "'" + (filter === null || filter === void 0 ? void 0 : filter.author[0]) + "'";
                }
                else {
                    authorStr = "'" + (filter === null || filter === void 0 ? void 0 : filter.author[0]) + "'";
                    for (var i = 1; i < (filter === null || filter === void 0 ? void 0 : filter.author.length); i++) {
                        authorStr += ',' + ("'" + (filter === null || filter === void 0 ? void 0 : filter.author[i]) + "'");
                    }
                }
            }
            /*  Query as page */
            if (topicStr && authorStr) {
                queryTotal = COUNT_TOTAL_ARTICLE_AUTHOR_TOPIC.replace('authorValues', authorStr).replace('topicValues', topicStr);
            }
            else if (topicStr) {
                queryTotal = COUNT_TOTAL_ARTICLE_TOPIC.replace('topicValues', topicStr);
            }
            else if (authorStr) {
                queryTotal = COUNT_TOTAL_ARTICLE_AUTHOR.replace('authorValues', authorStr);
            }
            else {
                queryTotal = COUNT_TOTAL_ARTICLE;
            }
            /*---------------------------------*/
            request.query(queryTotal, function (err, data) {
                if (err) {
                    log_system_1.HCommon.logError("[getAllPost] -> [query count total article]: " + err);
                    reject({
                        err: ERROR_CODE['500'],
                        statusCode: 500,
                    });
                }
                var item = data.recordset[0];
                var total = Object.values(item)[0];
                if (pageIndex == -1) {
                    start = 0;
                    pageSize = total;
                }
                else {
                    start = pageSize * (pageIndex - 1);
                }
                if (!found && pageIndex !== 1 && pageIndex !== -1) {
                    start = start - 1;
                }
                /*  Query as page */
                if (topicStr && authorStr) {
                    queryAsPage = GET_ARTICLE_AS_PAGE_AUTHOR_TOPIC.replace('orderByValue', orderBy)
                        .replace('orderTypeValue', orderType)
                        .replace('startValue', start)
                        .replace('pageSizeValue', pageSize.toString())
                        .replace('topicValues', topicStr)
                        .replace('authorValues', authorStr);
                }
                else if (topicStr) {
                    queryAsPage = GET_ARTICLE_AS_PAGE_TOPIC.replace('orderByValue', orderBy)
                        .replace('orderTypeValue', orderType)
                        .replace('startValue', start)
                        .replace('pageSizeValue', pageSize.toString())
                        .replace('topicValues', topicStr);
                }
                else if (authorStr) {
                    queryAsPage = GET_ARTICLE_AS_PAGE_AUTHOR.replace('orderByValue', orderBy)
                        .replace('orderTypeValue', orderType)
                        .replace('startValue', start)
                        .replace('pageSizeValue', pageSize.toString())
                        .replace('authorValues', authorStr);
                }
                else {
                    queryAsPage = GET_ARTICLE_AS_PAGE.replace('orderByValue', orderBy)
                        .replace('orderTypeValue', orderType)
                        .replace('startValue', start)
                        .replace('pageSizeValue', pageSize.toString());
                }
                /*---------------------------------*/
                console.log(queryAsPage);
                request.query(queryAsPage, function (err, data) { return __awaiter(void 0, void 0, void 0, function () {
                    var recordset, _a, newList, found, newRecordset;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (err) {
                                    log_system_1.HCommon.logError("[getAllPost] -> [query articles as page]: " + err);
                                    reject({
                                        err: ERROR_CODE['500'],
                                        statusCode: 500,
                                    });
                                }
                                recordset = data.recordset;
                                return [4 /*yield*/, updateHeadArticle(recordset, headArticle, pageIndex)];
                            case 1:
                                _a = _b.sent(), newList = _a.newList, found = _a.found;
                                newRecordset = newList || recordset;
                                response.data = newRecordset;
                                response.totalRecord = total;
                                response.found = found;
                                resolve(response);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        executeQuery
            .then(function (response) { return res.json(response); })
            .catch(function (_a) {
            var err = _a.err, statusCode = _a.statusCode;
            res.statusCode = statusCode;
            res.json(err);
        });
        return [2 /*return*/];
    });
}); };
exports.getAllPost = getAllPost;
var getAllPostToCache = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, paging, orderList, headArticle, found;
    return __generator(this, function (_a) {
        query = req.query;
        paging = { pageIndex: parseInt(query.pageIndex), pageSize: parseInt(query.pageSize) };
        orderList = { orderBy: query.orderBy, orderType: query.orderType };
        headArticle = query.headArticle;
        found = Boolean(query.found);
        exports.getAllPost({ body: { paging: paging, orderList: orderList, headArticle: headArticle, found: found, filter: null } }, res);
        return [2 /*return*/];
    });
}); };
exports.getAllPostToCache = getAllPostToCache;
var getDetailPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, request;
    return __generator(this, function (_a) {
        id = req.body.id;
        request = new sql.Request();
        request.query(GET_DETAIL_POST.replace('IdValue', id), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
                log_system_1.HCommon.logError("[getDetailPost] -> [query detail articles]: " + err);
            }
            var postData = data.recordset[0];
            res.json(postData);
        });
        return [2 /*return*/];
    });
}); };
exports.getDetailPost = getDetailPost;
var getDetailPostToCache = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        exports.getDetailPost({ body: { id: req.query.id } }, res);
        return [2 /*return*/];
    });
}); };
exports.getDetailPostToCache = getDetailPostToCache;
var searchArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var searchTxt, request;
    return __generator(this, function (_a) {
        searchTxt = req.body.searchTxt;
        request = new sql.Request();
        request.query(SEARCH_ARTICLES.replace('titleValue', searchTxt).replace('authorValue', searchTxt).replace('contentValue', searchTxt), function (err, data) {
            if (err) {
                res.statusCode = 500;
                res.json(500);
                log_system_1.HCommon.logError("[searchArticles] -> [query articles contain " + searchTxt + " text]: " + err);
            }
            var recordset = data.recordset;
            res.json({ data: recordset });
        });
        return [2 /*return*/];
    });
}); };
exports.searchArticles = searchArticles;
var getAllTopic = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, request;
    return __generator(this, function (_a) {
        response = [];
        request = new sql.Request();
        request.query(GET_ALL_TOPIC, function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[getAllTopic] -> [query all topic.");
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            recordset.map(function (item) {
                if (item && item.Topic) {
                    response.push(item.Topic);
                }
            });
            res.json(response.filter(function (a, b) { return response.indexOf(a) === b; }));
        });
        return [2 /*return*/];
    });
}); };
exports.getAllTopic = getAllTopic;
var getAllAuthor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, request;
    return __generator(this, function (_a) {
        response = [];
        request = new sql.Request();
        request.query(GET_ALL_AUTHOR, function (err, data) {
            if (err) {
                log_system_1.HCommon.logError("[getAllAuthor] -> [query all authors.");
                res.statusCode = 500;
                res.json(500);
            }
            var recordset = data.recordset;
            recordset.map(function (item) {
                if (item && item.Author) {
                    response.push(item.Author);
                }
            });
            res.json(response.filter(function (a, b) { return response.indexOf(a) === b; }));
        });
        return [2 /*return*/];
    });
}); };
exports.getAllAuthor = getAllAuthor;
