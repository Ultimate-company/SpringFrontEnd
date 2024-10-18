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
var rxjs_1 = require("rxjs");
var index_1 = require("./index");
describe('asyncMap', function () {
    it('returns empty observable for empty input', function () { return __awaiter(_this, void 0, void 0, function () {
        var project, input, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = jest.fn();
                    input = rxjs_1.Observable.empty();
                    return [4 /*yield*/, input.pipe(index_1.asyncMap(project, 0)).toArray().toPromise()];
                case 1:
                    output = _a.sent();
                    expect(output).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls project function in-order for all values in input', function () { return __awaiter(_this, void 0, void 0, function () {
        var project, input, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = jest.fn(function (x) { return Promise.resolve(x.length); });
                    input = rxjs_1.Observable.of('f', 'ba', 'baz');
                    return [4 /*yield*/, input.pipe(index_1.asyncMap(project, 1)).toArray().toPromise()];
                case 1:
                    output = _a.sent();
                    expect(output).toEqual([1, 2, 3]);
                    expect(project.mock.calls).toEqual([['f'], ['ba'], ['baz']]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls project function with the given concurrency', function () { return __awaiter(_this, void 0, void 0, function () {
        var invocations, input, project;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invocations = {};
                    input = rxjs_1.Observable.of('foo', 'bar', 'baz');
                    project = jest.fn(function (v) {
                        invocations[v] = Date.now();
                        return rxjs_1.Observable.of().delay(10).toPromise();
                    });
                    return [4 /*yield*/, input.pipe(index_1.asyncMap(project, 2)).toArray().toPromise()];
                case 1:
                    _a.sent();
                    expect(invocations['bar'] - invocations['foo']).toBeLessThan(5);
                    expect(invocations['baz']).toBeGreaterThan(invocations['foo']);
                    expect(invocations['baz']).toBeGreaterThan(invocations['bar']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('returns projected values in-order even if promises resolve out of order', function () { return __awaiter(_this, void 0, void 0, function () {
        var project, input, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = jest.fn(function (x) {
                        if (x === 'foo') {
                            return rxjs_1.Observable.of(1).delay(20).toPromise();
                        }
                        else {
                            return rxjs_1.Observable.of(2).delay(10).toPromise();
                        }
                    });
                    input = rxjs_1.Observable.of('foo', 'bar');
                    return [4 /*yield*/, input.pipe(index_1.asyncMap(project, 1)).toArray().toPromise()];
                case 1:
                    output = _a.sent();
                    expect(output).toEqual([1, 2]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.spec.js.map