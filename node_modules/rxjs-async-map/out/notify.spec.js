"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var Observer_1 = require("rxjs/Observer");
var jasmine_promise_tools_1 = require("jasmine-promise-tools");
var notify_1 = require("./notify");
describe('Notify', function () {
    it('calls onReady when wrapped promise resolves', function () { return __awaiter(_this, void 0, void 0, function () {
        var onReady;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onReady = jest.fn(function (p) { return p.notifyIfReady(); });
                    return [4 /*yield*/, new Observable_1.Observable(function (sub) {
                            notify_1.notify(Promise.resolve(), sub, onReady);
                        }).toPromise()];
                case 1:
                    _a.sent();
                    expect(onReady).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls onReady when wrapped promise rejects', function () { return __awaiter(_this, void 0, void 0, function () {
        var onReady, promise, err;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onReady = jest.fn(function (p) { return p.notifyIfReady(); });
                    promise = new Observable_1.Observable(function (sub) {
                        notify_1.notify(Promise.reject('error'), sub, onReady);
                    }).toPromise();
                    return [4 /*yield*/, jasmine_promise_tools_1.expectToReject(promise)];
                case 1:
                    err = _a.sent();
                    expect(err).toBe('error');
                    expect(onReady).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('signals non-readiness when the wrapped promise has not been resolved yet', function () {
        var onReady = jest.fn();
        var notifier = notify_1.notify(Promise.reject('error'), Observer_1.empty, onReady);
        expect(notifier.notifyIfReady()).toBe(false);
    });
});
//# sourceMappingURL=notify.spec.js.map