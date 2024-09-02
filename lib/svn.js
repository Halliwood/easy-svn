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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
    SVNClient.prototype.cmd = function (command, params, options, silent) {
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
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent) && !silent)
                                process.stdout.write(String(data));
                            _this.text += data;
                        });
                        //执行失败
                        proc.stderr.on('data', function (data) {
                            var _a;
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent) && !silent)
                                process.stderr.write(String(data));
                            _this.err = new Error(String(data));
                        });
                        // 进程错误
                        proc.on('error', function (error) {
                            var _a;
                            if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent) && !silent)
                                console.error(error);
                            _this.isRuning = false;
                            reject(error);
                        });
                        // 进程关闭
                        proc.on('close', function (code) {
                            var _a;
                            _this.isRuning = false;
                            if (code == 0) {
                                resolve(_this.text || '');
                            }
                            else {
                                reject((_a = _this.err) !== null && _a !== void 0 ? _a : new Error("cmd 'svn ".concat(svnParams.join(' '), "' failed, error code: ").concat(code)));
                            }
                        });
                    })];
            });
        });
    };
    SVNClient.prototype.checkout = function (url, path, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params, infoStr, nmc, name_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!path)
                            path = this.defaultCWD;
                        if (!(typeof (url) === 'string')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.info(url)];
                    case 1:
                        infoStr = _b.sent();
                        if (!infoStr.includes('Node Kind: file')) return [3 /*break*/, 3];
                        nmc = infoStr.match(/Name: (\S+)/);
                        name_1 = nmc[1];
                        return [4 /*yield*/, this.cmd('co', this.joinUsernameAndPassword([url.substring(0, url.length - name_1.length), path, '--depth=empty']))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, this.update(path_1.default.join(path, name_1))];
                    case 3:
                        params = [url];
                        return [3 /*break*/, 5];
                    case 4:
                        params = url ? url : [(_a = this.cfg) === null || _a === void 0 ? void 0 : _a.responsitory];
                        _b.label = 5;
                    case 5:
                        if (path != null)
                            params.push(path);
                        if (option != null) {
                            this.handleRevisionOption(option, params);
                            this.handleQuiteOption(option, params);
                            this.handleDepthOption(option, params);
                            if (option.force)
                                params.push('--force');
                            if (option.ignoreExternals)
                                params.push('--ignore-externals');
                        }
                        return [2 /*return*/, this.cmd('co', this.joinUsernameAndPassword(params))];
                }
            });
        });
    };
    SVNClient.prototype.update = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleDepthOption(option, svnParams);
                        this.handleQuiteOption(option, svnParams);
                        this.handleChangelistOption(option, svnParams);
                        if (option.setDepth)
                            svnParams.push('--set-depth', option.setDepth);
                        if (option.diff3Cmd)
                            svnParams.push('--diff3-cmd', option.diff3Cmd);
                        if (option.force)
                            svnParams.push('--force');
                        if (option.ignoreExternals)
                            svnParams.push('--ignore-externals');
                        if (option.editorCmd)
                            svnParams.push('--editor-cmd', option.editorCmd);
                        if (option.accept)
                            svnParams.push('--accept', option.accept);
                        if (option.parents)
                            svnParams.push('--parents');
                        if (option.addsAsModification)
                            svnParams.push('--adds-as-modification');
                    }
                    return [2 /*return*/, this.cmd('up', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('up', this.joinUsernameAndPassword(params))];
                }
                return [2 /*return*/];
            });
        });
    };
    SVNClient.prototype.commit = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleDepthOption(option, svnParams);
                        this.handleMessagableOption(option, svnParams);
                        this.handleChangelistOption(option, svnParams);
                        if (option.noUnlock)
                            svnParams.push('--no-unlock');
                        if (option.editorCmd)
                            svnParams.push('--editor-cmd', option.editorCmd);
                        if (option.withRevprop)
                            svnParams.push('--with-revprop', option.withRevprop);
                        if (option.keepChangelists)
                            svnParams.push('--keep-changelists');
                        if (option.includeExternals)
                            svnParams.push('--include-externals');
                    }
                    return [2 /*return*/, this.cmd('add', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('ci', this.joinUsernameAndPassword(__spreadArray(__spreadArray([], params.slice(1), true), ["-m ".concat(params[0] || 'no message')], false)))];
                }
                return [2 /*return*/];
            });
        });
    };
    SVNClient.prototype.add = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleDepthOption(option, svnParams);
                        this.handleQuiteOption(option, svnParams);
                        if (option.force)
                            svnParams.push('--force');
                        if (option.noIgnore)
                            svnParams.push('--no-ignore');
                        if (option.autoProps)
                            svnParams.push('--auto-props');
                        if (option.noAutoProps)
                            svnParams.push('--no-auto-props');
                        if (option.parents)
                            svnParams.push('--parents');
                    }
                    return [2 /*return*/, this.cmd('add', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('add', this.joinUsernameAndPassword(__spreadArray(['--force', '--parents'], params, true)))];
                }
                return [2 /*return*/];
            });
        });
    };
    SVNClient.prototype.delete = function (paths, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (typeof (paths) === 'string') {
                    params = [paths];
                }
                else {
                    params = paths;
                }
                if (option != null) {
                    this.handleQuiteOption(option, params);
                    this.handleMessagableOption(option, params);
                    if (option.force)
                        params.push('--force');
                    if (option.targets)
                        params.push.apply(params, __spreadArray(['--targets'], option.targets, false));
                    if (option.editorCmd)
                        params.push('--editor-cmd', option.editorCmd);
                    if (option.withRevprop)
                        params.push('--with-revprop', option.withRevprop);
                    if (option.keepLocal)
                        params.push('--keep-local');
                }
                return [2 /*return*/, this.cmd('delete', this.joinUsernameAndPassword(params))];
            });
        });
    };
    /**
     * use {@link delete} instead.
     * @deprecated
     */
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
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleRevisionOption(option, svnParams);
                        this.handleWalkOption(option, svnParams);
                        this.handleOutputOption(option, svnParams);
                        this.handleDepthOption(option, svnParams);
                        if (option.includeExternals)
                            svnParams.push('--include-externals');
                        if (option.showItem)
                            svnParams.push('--show-item', option.showItem);
                        if (option.noNewline)
                            svnParams.push('--no-newline');
                    }
                    return [2 /*return*/, this.cmd('info', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('info', this.joinUsernameAndPassword(params))];
                }
                return [2 /*return*/];
            });
        });
    };
    SVNClient.prototype.status = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleRevisionOption(option, svnParams);
                        this.handleDepthOption(option, svnParams);
                        this.handleQuiteOption(option, svnParams);
                        this.handleOutputOption(option, svnParams);
                        this.handleChangelistOption(option, svnParams);
                        if (option.verbose)
                            svnParams.push('--verbose');
                        if (option.noIgnore)
                            svnParams.push('--no-ignore');
                        if (option.ignoreExternals)
                            svnParams.push('--ignore-externals');
                    }
                    return [2 /*return*/, this.cmd('status', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('status', this.joinUsernameAndPassword(params))];
                }
                return [2 /*return*/];
            });
        });
    };
    SVNClient.prototype.log = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var t0, svnParams, option, i, len;
            return __generator(this, function (_a) {
                if (params.length == 0) {
                    params = [this.defaultCWD];
                }
                t0 = typeof (params[0]);
                if (t0 === 'object') {
                    svnParams = __spreadArray([], params[0], true);
                    if (params.length == 2) {
                        option = params[1];
                        this.handleRevisionOption(option, svnParams);
                        this.handleQuiteOption(option, svnParams);
                        this.handleOutputOption(option, svnParams);
                        this.handleDepthOption(option, svnParams);
                        if (option.change)
                            svnParams.push('--change', option.change);
                        if (option.verbose)
                            svnParams.push('--verbose');
                        if (option.useMergeHistory)
                            svnParams.push('--use-merge-history');
                        if (option.stopOnCopy)
                            svnParams.push('--stop-on-copy');
                        if (option.limit)
                            svnParams.push('--limit', String(option.limit));
                        if (option.withAllRevprops)
                            svnParams.push('--with-all-revprops');
                        if (option.withNoRevprops)
                            svnParams.push('--with-no-revprops');
                        if (option.withRevprops)
                            svnParams.push('--with-revprops');
                        if (option.diffCmd)
                            svnParams.push('--diff-cmd', option.diffCmd);
                        if (option.internalDiff)
                            svnParams.push('--internal-diff');
                        if (option.search) {
                            svnParams.push('--search');
                            for (i = 0, len = option.search.length; i < len; i++) {
                                if (i > 0)
                                    svnParams.push('--search-and');
                                svnParams.push(option.search[i]);
                            }
                        }
                    }
                    return [2 /*return*/, this.cmd('log', this.joinUsernameAndPassword(svnParams))];
                }
                else {
                    return [2 /*return*/, this.cmd('log', this.joinUsernameAndPassword(params))];
                }
                return [2 /*return*/];
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
        return __awaiter(this, void 0, void 0, function () {
            var info;
            var _a;
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
            var lines, oldIgnore, e_1, changed, _a, ignoreList_1, i, fw, ignoreFile, ul;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!ignoreList.length) {
                            throw new Error('Nothing to ignore!');
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.cmd('propget', ['svn:ignore', wcRoot], undefined, true)];
                    case 2:
                        oldIgnore = _b.sent();
                        lines = oldIgnore.split(/\r?\n+/);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        lines = [];
                        return [3 /*break*/, 4];
                    case 4:
                        changed = false;
                        for (_a = 0, ignoreList_1 = ignoreList; _a < ignoreList_1.length; _a++) {
                            i = ignoreList_1[_a];
                            if (!lines.includes(i)) {
                                lines.push(i);
                                changed = true;
                            }
                        }
                        if (!changed) {
                            return [2 /*return*/, false];
                        }
                        fw = (0, util_1.promisify)(fs_1.default.writeFile);
                        ignoreFile = path_1.default.join(wcRoot, "easy-svn@ignore-".concat(Date.now(), ".txt"));
                        return [4 /*yield*/, fw(ignoreFile, lines.join('\n'))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.cmd('propset', ['svn:ignore', wcRoot, '-F', ignoreFile])];
                    case 6:
                        _b.sent();
                        ul = (0, util_1.promisify)(fs_1.default.unlink);
                        return [4 /*yield*/, ul(ignoreFile)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    SVNClient.prototype.copy = function (src, dst, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = [src, dst];
                if (option != null) {
                    this.handleRevisionOption(option, params);
                    this.handleQuiteOption(option, params);
                    this.handleMessagableOption(option, params);
                    if (option.parents)
                        params.push('--parents');
                    if (option.editorCmd)
                        params.push('--editor-cmd', option.editorCmd);
                    if (option.withRevprop)
                        params.push('--with-revprop', option.withRevprop);
                    if (option.pinExternals)
                        params.push('--pin-externals');
                }
                return [2 /*return*/, this.cmd('copy', this.joinUsernameAndPassword(params))];
            });
        });
    };
    SVNClient.prototype.list = function (target, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (typeof (target) === 'string') {
                    params = [target];
                }
                else {
                    params = target;
                }
                if (option != null) {
                    this.handleRevisionOption(option, params);
                    this.handleWalkOption(option, params);
                    this.handleOutputOption(option, params);
                    if (option.verbose)
                        params.push('--verbose');
                    if (option.depth)
                        params.push('--depth', option.depth);
                    if (option.includeExternals)
                        params.push('--include-externals');
                    if (option.search)
                        params.push('--search', option.search);
                }
                return [2 /*return*/, this.cmd('list', this.joinUsernameAndPassword(params))];
            });
        });
    };
    SVNClient.prototype.lock = function (target, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (typeof (target) === 'string') {
                    params = [target];
                }
                else {
                    params = target;
                }
                if (option != null) {
                    this.handleMessagableOption(option, params);
                    this.handleQuiteOption(option, params);
                    if (option.force)
                        params.push('--force');
                }
                return [2 /*return*/, this.cmd('lock', this.joinUsernameAndPassword(params))];
            });
        });
    };
    SVNClient.prototype.unlock = function (target, option) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                if (typeof (target) === 'string') {
                    params = [target];
                }
                else {
                    params = target;
                }
                if (option != null) {
                    this.handleQuiteOption(option, params);
                    if (option.force)
                        params.push('--force');
                }
                return [2 /*return*/, this.cmd('unlock', this.joinUsernameAndPassword(params))];
            });
        });
    };
    SVNClient.prototype.handleRevisionOption = function (option, params) {
        if (option.revision)
            params.push('-r', String(option.revision));
    };
    SVNClient.prototype.handleWalkOption = function (option, params) {
        if (option.recursive)
            params.push('--recursive');
        if (option.humanReadable)
            params.push('--human-readable');
    };
    SVNClient.prototype.handleOutputOption = function (option, params) {
        if (option.incremental)
            params.push('--incremental');
        if (option.xml)
            params.push('--xml');
    };
    SVNClient.prototype.handleMessagableOption = function (option, params) {
        if (option.message)
            params.push('-m', option.message);
        if (option.file)
            params.push('-F', option.file);
        if (option.forceLog)
            params.push('--force-log');
        if (option.encoding)
            params.push('--encoding', option.encoding);
    };
    SVNClient.prototype.handleDepthOption = function (option, params) {
        if (option.depth)
            params.push('--depth', option.depth);
    };
    SVNClient.prototype.handleQuiteOption = function (option, params) {
        if (option.quiet)
            params.push('--quiet');
    };
    SVNClient.prototype.handleChangelistOption = function (option, params) {
        if (option.changelist)
            params.push.apply(params, __spreadArray(['--changelist'], option.changelist, false));
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
//# sourceMappingURL=svn.js.map