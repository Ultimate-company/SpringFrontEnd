"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFullScreen = void 0;
exports.requestFullScreen = function (element) {
    var methods = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'];
    var methodName = methods.find(function (name) { return element[name]; });
    element[methodName]();
};
