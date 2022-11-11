"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVNClient = void 0;
var svn_1 = require("./svn");
Object.defineProperty(exports, "SVNClient", { enumerable: true, get: function () { return svn_1.SVNClient; } });
var svn_2 = require("./svn");
var cli = new svn_2.SVNClient();
try {
    cli.info('svn://192.168.8.72/DP_Client/branches/puerts/project');
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=index.js.map