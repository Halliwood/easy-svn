import { spawn, SpawnOptionsWithoutStdio } from 'child_process'

export interface SVNConfig {
    responsitory?: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
}

export class SVNClient {
    private text?: string;
    private err?: Error;
    private isRuning = false;

    private cfg?: SVNConfig;
    setConfig(cfg: SVNConfig) {
        this.cfg = cfg;
    }

    cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string> {
        this.text = '';
        // options = Object.assign(options || {}, { cwd: this.cfg.cwd });
        return new Promise((resolve: (data: string) => void, reject: (error: Error) => void) => {
            this.isRuning = true;

            let svnParams = [command, '--non-interactive', '--trust-server-cert'];
            
            if(params) svnParams = svnParams.concat(params);

            let proc = spawn('svn', svnParams, options);

            // 执行成功
            proc.stdout.on('data', (data) => {
                if(!this.cfg?.silent) process.stdout.write(String(data));
                this.text += data;
            })
    
            //执行失败
            proc.stderr.on('data', (data) => {
                if(!this.cfg?.silent) process.stderr.write(String(data));
                this.err = new Error(String(data));
            })
    
            // 进程错误
            proc.on('error', (error: Error) => {
                if(!this.cfg?.silent) console.error(error);
                this.isRuning = false;
                reject(error);
            })
    
            // 进程关闭
            proc.on('close', (code: number) => {
                this.isRuning = false;
                if(code == 0) {
                    resolve(this.text || '');
                } else {
                    reject(new Error(`proc exit with code: ${code}`));
                }
            })
        });
    }

    checkout(url?: string, path?: string): Promise<string> {
        return this.cmd('co', this.joinUsernameAndPassword([url || this.cfg?.responsitory!, path || this.defaultCWD]));
    }

    update(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('up', this.joinUsernameAndPassword(paths));
    }

    commit(msg: string, ...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('ci', this.joinUsernameAndPassword([...paths, `-m ${msg || 'no message'}`]));
    }

    add(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('add', this.joinUsernameAndPassword(['--force', '--parents', ...paths]));
    }

    del(msg: string, ...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('del', this.joinUsernameAndPassword([`-m ${msg || 'no message'}`, ...paths]));
    }

    info(...targets: string[]): Promise<string> {
        if(!targets.length) {
            targets = [this.defaultCWD];
        }
        return this.cmd('info', this.joinUsernameAndPassword(targets));
    }

    status(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('status', this.joinUsernameAndPassword(paths));
    }

    log(path?: string): Promise<string> {
        return this.cmd('log', this.joinUsernameAndPassword([path || this.defaultCWD]));
    }

    revert(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('revert', [...paths, '-R']);
    }

    /**
     * 
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns 
     */
    cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string> {
        if(!wcpaths.length) {
            wcpaths = [this.defaultCWD];
        }
        let params = wcpaths;
        if(rmUnversioned) params.push('--remove-unversioned');
        return this.cmd('cleanup', params);
    }

    addUnversioned(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('add', this.joinUsernameAndPassword(['--force', '--parents', '--no-ignore', ...paths]));
    }

    async getRevision(url?: string): Promise<number> {
        if(!url) url = this.cfg?.responsitory;
        if(!url) console.error(`No url provided or default configuration set for getRevision`);
        let info = await this.cmd('info', this.joinUsernameAndPassword([url!]));
        let mrt = info.match(/Revision: (\d+)/);
        let revision = 0;
        if(mrt) {
            revision = Number(mrt[1]);
        }
        return revision;
    }

    private joinUsernameAndPassword(params: string[]): string[] {
        if(this.cfg?.username) {
            params.push('--username', this.cfg.username);
        }
        if(this.cfg?.password) {
            params.push('--password', this.cfg.password);
        }
        return params;
    }

    private get defaultCWD(): string {
        return this.cfg?.cwd || process.cwd();
    }
}