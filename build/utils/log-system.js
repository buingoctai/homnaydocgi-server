"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HCommon = void 0;
exports.HCommon = {
    log: function (text) {
        console.log(text);
    },
    logError: function (text) {
        console.error(text);
    },
    logWarning: function (text) {
        console.warn(text);
    },
    logTrace: function (text) {
        console.trace(text);
    },
    logTable: function (data) {
        console.table(data);
    },
    logTimeStart: function () {
        console.time();
    },
    logTimeEnd: function () {
        console.timeEnd();
    },
};
