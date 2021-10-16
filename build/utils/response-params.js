"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepsonseAllPost = exports.RepsonseFeaturedPost = void 0;
var RepsonseFeaturedPost = /** @class */ (function () {
    function RepsonseFeaturedPost(data) {
        this.data = data;
    }
    return RepsonseFeaturedPost;
}());
exports.RepsonseFeaturedPost = RepsonseFeaturedPost;
var RepsonseAllPost = /** @class */ (function () {
    function RepsonseAllPost(data, totalRecord, found) {
        this.data = data;
        this.totalRecord = totalRecord;
        this.found = found;
    }
    return RepsonseAllPost;
}());
exports.RepsonseAllPost = RepsonseAllPost;
