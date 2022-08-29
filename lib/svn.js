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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVNClient = void 0;
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var SVNClient = /** @class */ (function () {
    function SVNClient() {
        this.isRuning = false;
    }
    SVNClient.prototype.setConfig = function (cfg) {
        this.cfg = cfg;
    };
    SVNClient.prototype.cmd = function (command, params, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.text = '';
                // options = Object.assign(options || {}, { cwd: this.cfg.cwd });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        _this.isRuning = true;
                        var svnParams = [command];
                        if ((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.globalParams) {
                            svnParams.push.apply(svnParams, _this.cfg.globalParams);
                        }
                        if (params)
                            svnParams = svnParams.concat(params);
                        var proc = (0, child_process_1.spawn)('svn', svnParams, options);
                        // 执行成功
                        proc.stdout.on('data', function (data) {
                            var _a;
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                                process.stdout.write(String(data));
                            _this.text += data;
                        });
                        //执行失败
                        proc.stderr.on('data', function (data) {
                            var _a;
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                                process.stderr.write(String(data));
                            _this.err = new Error(String(data));
                        });
                        // 进程错误
                        proc.on('error', function (error) {
                            var _a;
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                                console.error(error);
                            _this.isRuning = false;
                            reject(error);
                        });
                        // 进程关闭
                        proc.on('close', function (code) {
                            _this.isRuning = false;
                            if (code == 0) {
                                resolve(_this.text || '');
                            }
                            else {
                                reject(new Error("proc exit with code: ".concat(code)));
                            }
                        });
                    })];
            });
        });
    };
    SVNClient.prototype.checkout = function (url, path) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var infoStr, nmc, name_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!path)
                            path = this.defaultCWD;
                        if (!url) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.info(url)];
                    case 1:
                        infoStr = _b.sent();
                        if (!infoStr.includes('Node Kind: file')) return [3 /*break*/, 3];
                        nmc = infoStr.match(/Name: (\S+)/);
                        name_1 = nmc[1];
                        return [4 /*yield*/, this.cmd('co', this.joinUsernameAndPassword([url.substr(0, url.length - name_1.length), path, '--depth=empty']))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.update(path_1.default.join(path, name_1))];
                    case 3: return [2 /*return*/, this.cmd('co', this.joinUsernameAndPassword([url || ((_a = this.cfg) === null || _a === void 0 ? void 0 : _a.responsitory), path]))];
                }
            });
        });
    };
    SVNClient.prototype.update = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('up', this.joinUsernameAndPassword(paths))];
            });
        });
    };
    SVNClient.prototype.commit = function (msg) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('ci', this.joinUsernameAndPassword(__spreadArray(__spreadArray([], paths, true), ["-m ".concat(msg || 'no message')], false)))];
            });
        });
    };
    SVNClient.prototype.add = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('add', this.joinUsernameAndPassword(__spreadArray(['--force', '--parents'], paths, true)))];
            });
        });
    };
    SVNClient.prototype.del = function (msg) {
        var paths = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            paths[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('del', this.joinUsernameAndPassword(__spreadArray(["-m ".concat(msg || 'no message')], paths, true)))];
            });
        });
    };
    SVNClient.prototype.info = function () {
        var targets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            targets[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!targets.length) {
                    targets = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('info', this.joinUsernameAndPassword(targets))];
            });
        });
    };
    SVNClient.prototype.status = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('status', this.joinUsernameAndPassword(paths))];
            });
        });
    };
    SVNClient.prototype.log = function (path) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = this.joinUsernameAndPassword([path || this.defaultCWD]);
                if (options.length) {
                    params.push.apply(params, options);
                }
                return [2 /*return*/, this.cmd('log', params)];
            });
        });
    };
    SVNClient.prototype.revert = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('revert', __spreadArray(__spreadArray([], paths, true), ['-R'], false))];
            });
        });
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
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (!wcpaths.length) {
                    wcpaths = [this.defaultCWD];
                }
                params = wcpaths;
                if (rmUnversioned)
                    params.push('--remove-unversioned');
                return [2 /*return*/, this.cmd('cleanup', params)];
            });
        });
    };
    SVNClient.prototype.addUnversioned = function () {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!paths.length) {
                    paths = [this.defaultCWD];
                }
                return [2 /*return*/, this.cmd('add', this.joinUsernameAndPassword(__spreadArray(['--force', '--parents', '--no-ignore'], paths, true)))];
            });
        });
    };
    SVNClient.prototype.getRevision = function (url) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var info;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!url)
                            url = (_a = this.cfg) === null || _a === void 0 ? void 0 : _a.responsitory;
                        if (!url)
                            console.error("No url provided or default configuration set for getRevision");
                        return [4 /*yield*/, this.cmd('info', this.joinUsernameAndPassword([url, '--show-item', 'revision']))];
                    case 1:
                        info = _b.sent();
                        return [2 /*return*/, Number(info)];
                }
            });
        });
    };
    SVNClient.prototype.ignore = function (wcRoot) {
        var ignoreList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            ignoreList[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var oldIgnore, lines, _a, ignoreList_1, i, fw, ignoreFile, info, ul;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!ignoreList.length) {
                            throw new Error('Nothing to ignore!');
                        }
                        return [4 /*yield*/, this.cmd('propget', ['svn:ignore', wcRoot])];
                    case 1:
                        oldIgnore = _b.sent();
                        lines = oldIgnore.split(/\r?\n+/);
                        for (_a = 0, ignoreList_1 = ignoreList; _a < ignoreList_1.length; _a++) {
                            i = ignoreList_1[_a];
                            if (!lines.includes(i)) {
                                lines.push(i);
                            }
                        }
                        fw = (0, util_1.promisify)(fs_1.default.writeFile);
                        ignoreFile = path_1.default.join(wcRoot, "easy-svn@ignore-".concat(Date.now(), ".txt"));
                        return [4 /*yield*/, fw(ignoreFile, lines.join('\n'))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.cmd('propset', ['svn:ignore', wcRoot, '-F', ignoreFile])];
                    case 3:
                        info = _b.sent();
                        ul = (0, util_1.promisify)(fs_1.default.unlink);
                        return [4 /*yield*/, ul(ignoreFile)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, info];
                }
            });
        });
    };
    SVNClient.prototype.joinUsernameAndPassword = function (params) {
        var _a, _b;
        if ((_a = this.cfg) === null || _a === void 0 ? void 0 : _a.username) {
            params.push('--username', this.cfg.username);
        }
        if ((_b = this.cfg) === null || _b === void 0 ? void 0 : _b.password) {
            params.push('--password', this.cfg.password);
        }
        return params;
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
