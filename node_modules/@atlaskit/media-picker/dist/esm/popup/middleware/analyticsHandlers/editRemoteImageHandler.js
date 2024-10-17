import { __assign } from "tslib";
import { isEditRemoteImageAction } from '../../actions/editRemoteImage';
import { buttonClickPayload } from '.';
export default (function (action) {
    if (isEditRemoteImageAction(action)) {
        var collectionName = action.collectionName, _a = action.item, _b = (_a === void 0 ? {} : _a).id, id = _b === void 0 ? undefined : _b;
        return [
            __assign(__assign({}, buttonClickPayload), { actionSubjectId: 'annotateFileButton', attributes: {
                    collectionName: collectionName,
                    fileId: id,
                } }),
        ];
    }
});
//# sourceMappingURL=editRemoteImageHandler.js.map