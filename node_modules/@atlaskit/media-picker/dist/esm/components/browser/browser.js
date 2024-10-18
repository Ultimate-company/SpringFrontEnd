import { __extends } from "tslib";
import React from 'react';
import { withAnalyticsEvents, withAnalyticsContext, } from '@atlaskit/analytics-next';
import { LocalUploadComponentReact, } from '../localUploadReact';
import { name as packageName, version as packageVersion, } from '../../version.json';
var defaultConfig = { uploadParams: {} };
var BrowserBase = /** @class */ (function (_super) {
    __extends(BrowserBase, _super);
    function BrowserBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.browserRef = React.createRef();
        _this.onFilePicked = function (event) {
            if (!event.target) {
                return;
            }
            var filesArray = [].slice.call(event.target.files);
            try {
                _this.uploadService.addFiles(filesArray);
            }
            finally {
                if (_this.browserRef.current) {
                    _this.browserRef.current.value = '';
                }
            }
        };
        _this.browse = function () {
            var onClose = _this.props.onClose;
            if (!_this.browserRef.current) {
                return;
            }
            _this.browserRef.current.click();
            // Calling onClose directly since there is no dom api to notify us when
            // the native file picker is closed
            if (onClose) {
                onClose();
            }
        };
        return _this;
    }
    BrowserBase.prototype.componentDidMount = function () {
        var _a = this.props, onBrowseFn = _a.onBrowseFn, onCancelFn = _a.onCancelFn, isOpen = _a.isOpen;
        if (onBrowseFn) {
            onBrowseFn(this.browse);
        }
        if (onCancelFn) {
            onCancelFn(this.cancel);
        }
        if (isOpen) {
            this.browse();
        }
    };
    BrowserBase.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        var isOpen = this.props.isOpen;
        var nextIsOpen = nextProps.isOpen;
        if (nextIsOpen && nextIsOpen !== isOpen) {
            this.browse();
        }
    };
    BrowserBase.prototype.render = function () {
        var config = this.props.config;
        var multiple = config.multiple;
        var fileExtensions = config.fileExtensions && config.fileExtensions.join(',');
        return (React.createElement("input", { "data-testid": "media-picker-file-input", ref: this.browserRef, type: "file", style: { display: 'none' }, multiple: multiple, accept: fileExtensions, onChange: this.onFilePicked }));
    };
    BrowserBase.defaultProps = {
        config: defaultConfig,
    };
    return BrowserBase;
}(LocalUploadComponentReact));
export { BrowserBase };
export var Browser = withAnalyticsContext({
    attributes: {
        componentName: 'browser',
        packageName: packageName,
        packageVersion: packageVersion,
    },
})(withAnalyticsEvents()(BrowserBase));
//# sourceMappingURL=browser.js.map