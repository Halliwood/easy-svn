"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVNClient = void 0;
var child_process_1 = require("child_process");
var SVNClient = /** @class */ (function () {
    function SVNClient() {
        this.isRuning = false;
    }
    SVNClient.prototype.setConfig = function (cfg) {
        this.cfg = cfg;
    };
    SVNClient.prototype.cmd = function (command, params, options) {
        var _this = this;
        this.text = '';
        // options = Object.assign(options || {}, { cwd: this.cfg.cwd });
        return new Promise(function (resolve, reject) {
            var _a, _b, _c, _d;
            _this.isRuning = true;
            var svnParams = [command, '--non-interactive', '--trust-server-cert'];
            if ((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.username) {
                svnParams.push("--username " + ((_b = _this.cfg) === null || _b === void 0 ? void 0 : _b.username));
            }
            if ((_c = _this.cfg) === null || _c === void 0 ? void 0 : _c.password) {
                svnParams.push("--password " + ((_d = _this.cfg) === null || _d === void 0 ? void 0 : _d.password));
            }
            if (params)
                svnParams = svnParams.concat(params);
            var proc = child_process_1.spawn('svn', svnParams, options);
            // ????????????
            proc.stdout.on('data', function (data) {
                var _a;
                if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                    console.log(String(data));
                _this.text += data;
            });
            //????????????
            proc.stderr.on('data', function (data) {
                var _a;
                if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                    console.error(String(data));
                _this.err = new Error(String(data));
            });
            // ????????????
            proc.on('error', function (error) {
                var _a;
                if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                    console.error(error);
                _this.isRuning = false;
                reject(error);
            });
            // ????????????
            proc.on('close', function (code) {
                _this.isRuning = false;
                if (code == 0) {
                    resolve(_this.text || '');
                }
                else {
                    reject(new Error("proc exit with code: " + code));
                }
            });
        });
    };
    SVNClient.prototype.checkout = function (url, path) {
        var _a;
        return this.cmd('co', [url || ((_a = this.cfg) === null || _a === void 0 ? void 0 : _a.responsitory), path || this.defaultCWD]);
    };
    SVNClient.prototype.update = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('up', paths);
    };
    SVNClient.prototype.commit = function (msg) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('ci', __spreadArrays(paths, ["-m " + (msg || 'no message')]));
    };
    SVNClient.prototype.add = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('add', __spreadArrays(['--force', '--parents'], paths));
    };
    SVNClient.prototype.del = function (msg) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('del', __spreadArrays(["-m " + (msg || 'no message')], paths));
    };
    SVNClient.prototype.info = function () {
        var targets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targets[_i] = arguments[_i];
        }
        if (!targets.length) {
            targets = [this.defaultCWD];
        }
        return this.cmd('info', targets);
    };
    SVNClient.prototype.status = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('status', paths);
    };
    SVNClient.prototype.log = function (path) {
        return this.cmd('log', [path || this.defaultCWD]);
    };
    SVNClient.prototype.revert = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('revert', __spreadArrays(paths, ['-R']));
    };
    /**
     *
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns
     */
    SVNClient.prototype.cleanup = function (rmUnversioned) {
        var wcpaths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            wcpaths[_i - 1] = arguments[_i];
        }
        if (!wcpaths.length) {
            wcpaths = [this.defaultCWD];
        }
        var params = wcpaths;
        if (rmUnversioned)
            params.push('--remove-unversioned');
        return this.cmd('cleanup', params);
    };
    SVNClient.prototype.addUnversioned = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        if (!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('add', __spreadArrays(['--force', '--parents', '--no-ignore'], paths));
    };
    SVNClient.prototype.getRevision = function (url) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var info, mrt, revision;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!url)
                            url = (_a = this.cfg) === null || _a === void 0 ? void 0 : _a.responsitory;
                        if (!url)
                            console.error("No url provided or default configuration set for getRevision");
                        return [4 /*yield*/, this.cmd('info', [url])];
                    case 1:
                        info = _b.sent();
                        mrt = info.match(/Revision: (\d+)/);
                        revision = 0;
                        if (mrt) {
                            revision = Number(mrt[1]);
                        }
                        return [2 /*return*/, revision];
                }
            });
        });
    };
    Object.defineProperty(SVNClient.prototype, "defaultCWD", {
        get: function () {
            var _a;
            return ((_a = this.cfg) === null || _a === void 0 ? void 0 : _a.cwd) || process.cwd();
        },
        enumerable: false,
        configurable: true
    });
    return SVNClient;
}());
exports.SVNClient = SVNClient;
