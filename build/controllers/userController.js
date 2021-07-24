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
var uuidv4 = require('uuid/v4');
var jwt = require('jsonwebtoken');
var sql = require('mssql');
var constants = require('../utils/constants');
var PYTHON_SERVER_URL = constants.PYTHON_SERVER_URL, INSERT_USER_DATA = constants.INSERT_USER_DATA, USER_FIND = constants.USER_FIND, INSERT_PERSONALIZED_INFORMS = constants.INSERT_PERSONALIZED_INFORMS, DATABASE_SERVER_CONFIG_DEV = constants.DATABASE_SERVER_CONFIG_DEV;
//-------------
exports.submitUserData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var request, _a, userName, fbUrl, techKnowledge, addKnowledge, isStringTech, isStringAdd, id, fakeConfidentTech, fakeConfidentAdd, techHandler, addHandler, token, responseChoosing;
    return __generator(this, function (_b) {
        request = require('superagent');
        _a = req.body, userName = _a.userName, fbUrl = _a.fbUrl, techKnowledge = _a.techKnowledge, addKnowledge = _a.addKnowledge;
        isStringTech = typeof techKnowledge === 'string';
        isStringAdd = typeof addKnowledge === 'string';
        id = uuidv4();
        if (isStringTech && isStringAdd) {
            // Saving to database to Users table
            sql.connect(DATABASE_SERVER_CONFIG_DEV, function (err) {
                if (err)
                    console.log(err);
                var request = new sql.Request();
                // Check value exist (UserName & FbUrl) in Users table
                request.query(INSERT_USER_DATA.replace('IdValue', id)
                    .replace('UserNameValue', userName)
                    .replace('FbUrlValue', fbUrl)
                    .replace('TechTxtValue', techKnowledge)
                    .replace('AddTxtValue', addKnowledge), function (err) {
                    if (err)
                        console.log('INSERT USERS TABLE=', err);
                });
            });
            fakeConfidentTech = 0.69;
            fakeConfidentAdd = 0.69;
            techHandler = {};
            addHandler = {};
            if (fakeConfidentTech > 0.7) {
                techHandler = {
                    classified: true,
                    labels: ['Mobile'],
                };
            }
            else {
                // Query into database: labels
                techHandler = {
                    classified: false,
                    labels: ['Front-End', 'Back-End', 'Mobile'],
                };
            }
            if (fakeConfidentAdd > 0.7) {
                addHandler = {
                    classified: true,
                    labels: ['Marketing'],
                };
            }
            else {
                // Query into database: labels
                addHandler = {
                    classified: false,
                    labels: ['Marketing', 'Leader', 'Sales'],
                };
            }
            token = jwt.sign({ id: id }, 'SECET_KEY', {
                expiresIn: '1h',
            });
            // Insert personalized informs
            if (techHandler.classified && addHandler.classified) {
                sql.connect(DATABASE_SERVER_CONFIG_DEV, function (err) {
                    if (err)
                        console.log(err);
                    var request = new sql.Request();
                    request.query(INSERT_PERSONALIZED_INFORMS.replace('UserIdValue', id).replace('TechListValue', 'Mobile').replace('AddListValue', 'Marketing'), function (err) {
                        if (err)
                            console.log('INSERT PERSONALIZEDINFORMS TABLE=', err);
                    });
                });
            }
            res.status(200).send({
                techHandler: techHandler,
                addHandler: addHandler,
                token: token,
            });
        }
        else {
            // Insert personalized informs
            sql.connect(DATABASE_SERVER_CONFIG_DEV, function (err) {
                if (err)
                    console.log(err);
                var request = new sql.Request();
                request.query(INSERT_PERSONALIZED_INFORMS.replace('UserIdValue', id)
                    .replace('TechListValue', techKnowledge.toString())
                    .replace('AddListValue', addKnowledge.toString()), function (err) {
                    if (err)
                        console.log('INSERT PERSONALIZEDINFORMS TABLE=', err);
                });
            });
            responseChoosing = {
                techHandler: {
                    classified: true,
                    labels: techKnowledge,
                },
                addHandler: {
                    classified: true,
                    labels: addKnowledge,
                },
            };
            res.status(200).send(__assign({}, responseChoosing));
        }
        return [2 /*return*/];
    });
}); };
exports.auhtencation = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, token;
    return __generator(this, function (_a) {
        authorization = req.headers.authorization;
        token = authorization.split(' ')[1];
        jwt.verify(token, 'SECET_KEY', function (err, data) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.',
                });
            }
            else {
                return res.json(data);
            }
        });
        return [2 /*return*/];
    });
}); };
exports.getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        userId = req.body.userId;
        sql.connect(DATABASE_SERVER_CONFIG_DEV, function (err) {
            if (err)
                res.status(500).send({});
            var request = new sql.Request();
            request.query(USER_FIND.replace('IdValue', userId), function (err, data) {
                if (err)
                    res.status(500).send();
                var userData = data.recordset[0];
                res.json(userData);
            });
        });
        return [2 /*return*/];
    });
}); };
exports.example = function (req, res) {
    res.status(200).send({
        author: 'bui ngoc tai',
    });
};
