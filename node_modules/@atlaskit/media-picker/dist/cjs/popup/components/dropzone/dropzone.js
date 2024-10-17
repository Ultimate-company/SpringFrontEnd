"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_2 = require("react");
var react_intl_1 = require("react-intl");
var media_ui_1 = require("@atlaskit/media-ui");
var styled_1 = require("./styled");
var icons_1 = require("./icons");
var Dropzone = /** @class */ (function (_super) {
    tslib_1.__extends(Dropzone, _super);
    function Dropzone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dropzone.prototype.render = function () {
        var isActive = this.props.isActive;
        return (react_1.default.createElement(styled_1.Wrapper, { isActive: isActive },
            react_1.default.createElement(styled_1.Content, null,
                react_1.default.createElement(icons_1.UploadIcon, null),
                react_1.default.createElement(styled_1.Label, null,
                    react_1.default.createElement(react_intl_1.FormattedMessage, tslib_1.__assign({}, media_ui_1.messages.drop_your_files)))),
            react_1.default.createElement(styled_1.Glass, null)));
    };
    return Dropzone;
}(react_2.Component));
exports.Dropzone = Dropzone;
//# sourceMappingURL=dropzone.js.map