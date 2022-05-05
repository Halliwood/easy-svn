import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import p from 'path';

export interface SVNConfig {
    responsitory?: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
    globalParams?: string[];
}

export class SVNClient {
    private text?: string;
    private err?: Error;
    private isRuning = false;

    private cfg?: SVNConfig;
    setConfig(cfg: SVNConfig) {
        this.cfg = cfg;
    }

    async cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string> {
        this.text = '';
        // options = Object.assign(options || {}, { cwd: this.cfg.cwd });
        return new Promise((resolve: (data: string) => void, reject: (error: Error) => void) => {
            this.isRuning = true;

            let svnParams = [command];
            if(this.cfg?.globalParams) {
                svnParams.push(...this.cfg.globalParams);
            }
            
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

    async checkout(url?: string, path?: string): Promise<string> {
        if(!path) path = this.defaultCWD;
        if(url) {
            // 检查是否单个文件
            let infoStr = await this.info(url);
            if(infoStr.includes('Node Kind: file')) {
                // single file
                let nmc = infoStr.match(/Name: (\S+)/);
                let name = nmc![1];
                await this.cmd('co', this.joinUsernameAndPassword([url.substr(0, url.length - name.length), path, '--depth=empty']));
                return this.update(p.join(path, name));
            }
        }
        return this.cmd('co', this.joinUsernameAndPassword([url || this.cfg?.responsitory!, path]));
    }

    async update(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('up', this.joinUsernameAndPassword(paths));
    }

    async commit(msg: string, ...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('ci', this.joinUsernameAndPassword([...paths, `-m ${msg || 'no message'}`]));
    }

    async add(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('add', this.joinUsernameAndPassword(['--force', '--parents', ...paths]));
    }

    async del(msg: string, ...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('del', this.joinUsernameAndPassword([`-m ${msg || 'no message'}`, ...paths]));
    }

    async info(...targets: string[]): Promise<string> {
        if(!targets.length) {
            targets = [this.defaultCWD];
        }
        return this.cmd('info', this.joinUsernameAndPassword(targets));
    }

    async status(...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('status', this.joinUsernameAndPassword(paths));
    }

    async log(path?: string): Promise<string> {
        return this.cmd('log', this.joinUsernameAndPassword([path || this.defaultCWD]));
    }

    async revert(...paths: string[]): Promise<string> {
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
    async cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string> {
        if(!wcpaths.length) {
            wcpaths = [this.defaultCWD];
        }
        let params = wcpaths;
        if(rmUnversioned) params.push('--remove-unversioned');
        return this.cmd('cleanup', params);
    }

    async addUnversioned(...paths: string[]): Promise<string> {
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