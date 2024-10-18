"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRemoteCloudAccount = function (serviceName) {
    return serviceName === 'google' || serviceName === 'dropbox';
};
exports.isServiceFolder = function (item) {
    return item.mimeType === 'application/vnd.atlassian.mediapicker.folder';
};
exports.isServiceFile = function (item) {
    return item.mimeType !== 'application/vnd.atlassian.mediapicker.folder';
};
//# sourceMappingURL=index.js.map