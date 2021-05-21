"use strict";
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
            // 执行成功
            proc.stdout.on('data', function (data) {
                var _a;
                if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                    console.log(String(data));
                _this.text += data;
            });
            //执行失败
            proc.stderr.on('data', function (data) {
                var _a;
                if (!((_a = _this.cfg) === null || _a === void 0 ? void 0 : _a.silent))
                    console.error(String(data));
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
