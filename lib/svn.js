"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVNClient = void 0;
var child_process_1 = require("child_process");
var path_1 = require("path");
var SVNClient = /** @class */ (function () {
    function SVNClient(cfg) {
        this.cfg = cfg;
        this.isRuning = false;
        if (!cfg.cwd) {
            cfg.cwd = path_1.resolve(__dirname);
        }
    }
    SVNClient.prototype.cmd = function (command, params, options) {
        var _this = this;
        this.text = '';
        // options = Object.assign(options || {}, { cwd: this.cfg.cwd });
        return new Promise(function (resolve, reject) {
            _this.isRuning = true;
            var svnParams = [command, '--non-interactive', '--trust-server-cert'];
            if (_this.cfg.username) {
                svnParams.push("--username " + _this.cfg.username);
            }
            if (_this.cfg.password) {
                svnParams.push("--password " + _this.cfg.password);
            }
            if (params)
                svnParams = svnParams.concat(params);
            var proc = child_process_1.spawn('svn', svnParams, options);
            // 执行成功
            proc.stdout.on('data', function (data) {
                if (!_this.cfg.silent)
                    console.log(String(data));
                _this.text += data;
            });
            //执行失败
            proc.stderr.on('data', function (data) {
                if (!_this.cfg.silent)
                    console.error(String(data));
                _this.err = new Error(String(data));
            });
            // 进程错误
            proc.on('error', function (error) {
                if (!_this.cfg.silent)
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
    SVNClient.prototype.checkout = function () {
        return this.cmd('co', [this.cfg.responsitory, this.cfg.cwd]);
    };
    SVNClient.prototype.update = function () {
        return this.cmd('up', [this.cfg.cwd]);
    };
    SVNClient.prototype.commit = function (msg) {
        return this.cmd('ci', [this.cfg.cwd, "-m " + (msg || 'no message')]);
    };
    SVNClient.prototype.add = function (paths) {
        return this.cmd('add', ['--force', '--parents'].concat(paths));
    };
    SVNClient.prototype.del = function (paths, msg) {
        return this.cmd('del', ["-m " + (msg || 'no message')].concat(paths));
    };
    SVNClient.prototype.info = function () {
        return this.cmd('info', [this.cfg.cwd]);
    };
    SVNClient.prototype.status = function () {
        return this.cmd('status', [this.cfg.cwd]);
    };
    SVNClient.prototype.log = function () {
        return this.cmd('log', [this.cfg.cwd]);
    };
    SVNClient.prototype.revert = function () {
        return this.cmd('revert', [this.cfg.cwd, '-R']);
    };
    /**
     *
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns
     */
    SVNClient.prototype.cleanup = function (rmUnversioned) {
        var params = [this.cfg.cwd];
        if (rmUnversioned)
            params.push('--remove-unversioned');
        return this.cmd('cleanup', params);
    };
    SVNClient.prototype.addUnversioned = function () {
        return this.cmd('add', ['--force', '--parents', '--no-ignore'].concat(this.cfg.cwd));
    };
    return SVNClient;
}());
exports.SVNClient = SVNClient;
