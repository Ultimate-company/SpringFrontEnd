import { __extends } from "tslib";
import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { changeService } from '../../../actions/changeService';
import { Wrapper, ServiceIcon, ServiceName } from './styled';
var StatelessSidebarItem = /** @class */ (function (_super) {
    __extends(StatelessSidebarItem, _super);
    function StatelessSidebarItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClick = function () { return _this.props.onChangeService(_this.props.serviceName); };
        return _this;
    }
    StatelessSidebarItem.prototype.render = function () {
        var _a = this.props, serviceFullName = _a.serviceFullName, serviceName = _a.serviceName, isActive = _a.isActive, children = _a.children;
        return (React.createElement(Wrapper, { "data-testid": "media-picker-" + serviceName + "-menu-item", isActive: isActive, onClick: this.onClick },
            React.createElement(ServiceIcon, null, children),
            React.createElement(ServiceName, null, serviceFullName)));
    };
    return StatelessSidebarItem;
}(Component));
export { StatelessSidebarItem };
var mapDispatchToProps = function (dispatch) { return ({
    onChangeService: function (serviceName) {
        return dispatch(changeService(serviceName));
    },
}); };
export default connect(null, mapDispatchToProps)(StatelessSidebarItem);
//# sourceMappingURL=sidebarItem.js.map