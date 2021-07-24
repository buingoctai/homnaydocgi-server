"use strict";
var sql = require('mssql');
var constants = require('../utils/constants');
var uuidv4 = require('uuid/v4');
var webpush = require('web-push');
var GET_ALL_SUBSCRITION = constants.GET_ALL_SUBSCRITION, INSERT_SUBSCRITION = constants.INSERT_SUBSCRITION, DELETE_SUBSCRIPTION = constants.DELETE_SUBSCRIPTION;
var vapidKeys = {
    privateKey: 'bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU',
    publicKey: 'BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8',
};
webpush.setVapidDetails('mailto:example@yourdomain.org', vapidKeys.publicKey, vapidKeys.privateKey);
exports.saveSubscription = function (req, res) {
    var subscriptionString = JSON.stringify(req.body);
    var idValue = uuidv4();
    var request = new sql.Request();
    request.query(INSERT_SUBSCRITION.replace('idValue', idValue).replace('subscriptionValue', subscriptionString), function (err) {
        if (err) {
            res.statusCode = 500;
            res.json(err);
        }
        else {
            res.json({
                subscriptionId: idValue,
            });
        }
    });
};
exports.deleteSubscription = function (req, res) {
    var subscriptionId = req.body.subscriptionId;
    var request = new sql.Request();
    request.query(DELETE_SUBSCRIPTION.replace('idValue', subscriptionId), function (err) {
        if (err) {
            res.statusCode = 500;
            res.json(err);
        }
        res.json();
    });
};
var performSendNotification = function (_a) {
    var subscriptionList = _a.subscriptionList, title = _a.title;
    for (index in subscriptionList) {
        webpush
            .sendNotification(JSON.parse(subscriptionList[index].Subscription), JSON.stringify({
            title: 'Nội dung mới',
            text: title,
            tag: 'new',
            url: 'https://homnaydocgi-pwa-2rat3.ondigitalocean.app/',
        }))
            .catch(function (err) {
            console.log(err);
        });
    }
};
exports.sendNotificationToAll = function (req, res) {
    console.log('req', req);
    var title = req.body.title;
    var request = new sql.Request();
    request.query(GET_ALL_SUBSCRITION, function (err, data) {
        // if (err) {
        //   res.statusCode = 500;
        //   res.json(err);
        // }
        var subscriptionList = data.recordset;
        performSendNotification({
            subscriptionList: subscriptionList,
            title: title,
        });
        //res.json('');
    });
};
