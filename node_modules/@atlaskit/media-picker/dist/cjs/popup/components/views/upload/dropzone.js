'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_2 = require("react");
var react_intl_1 = require("react-intl");
var media_ui_1 = require("@atlaskit/media-ui");
var uploadButton_1 = tslib_1.__importDefault(require("./uploadButton"));
var icons_1 = require("../../../../icons");
var styled_1 = require("./styled");
var Dropzone = /** @class */ (function (_super) {
    tslib_1.__extends(Dropzone, _super);
    function Dropzone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dropzone.prototype.render = function () {
        var _a = this.props, isEmpty = _a.isEmpty, browserRef = _a.browserRef;
        return (react_1.default.createElement(styled_1.DropzoneContainer, { isEmpty: isEmpty },
            react_1.default.createElement(styled_1.DropzoneContentWrapper, null,
                react_1.default.createElement(styled_1.DefaultImage, { src: icons_1.filesIcon }),
                react_1.default.createElement(styled_1.TextWrapper, null,
                    react_1.default.createElement(styled_1.DropzoneText, null,
                        react_1.default.createElement(react_intl_1.FormattedMessage, tslib_1.__assign({}, media_ui_1.messages.drag_and_drop_your_files))),
                    react_1.default.createElement(styled_1.ButtonWrapper, null,
                        react_1.default.createElement(uploadButton_1.default, { browserRef: browserRef }))))));
    };
    return Dropzone;
}(react_2.Component));
exports.Dropzone = Dropzone;
//# sourceMappingURL=dropzone.js.map