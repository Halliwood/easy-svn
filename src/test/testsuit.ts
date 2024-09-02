import assert from "assert";
import fs from "fs"
import { SVNClient } from "../svn.js";

describe('SVN', function () {
    const tmp = 'tmp';
    if (fs.existsSync(tmp)) {
        fs.rmSync(tmp, { recursive: true, force: true });
    }
    fs.mkdirSync(tmp);

    const svn = new SVNClient();

    describe('Checkout', async function () {
        const out = await svn.checkout(['svn://192.168.8.72/DP_Client_Globe/trunk/project/log', 'svn://192.168.8.72/DP_Client_Globe/trunk/project/Logs'], tmp);
        assert.doesNotMatch(out, /svn: E\d{6}:/);
    });

    describe('Update', async function () {
        const out = await svn.update(['D:/works/dp/trunk/project']);
        assert.doesNotMatch(out, /svn: E\d{6}:/);
    });
});