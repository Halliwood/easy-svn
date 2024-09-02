import { spawn, SpawnOptionsWithoutStdio } from 'child_process'
import p from 'path';
import fs from 'fs';
import { promisify } from 'util';

export declare type TDepth = 'empty' | 'files' | 'immediates' | 'infinity'
export declare type TAccept = 'postpone' | 'working' | 'base' | 'mine-conflict' | 'theirs-conflict' | 'mine-full' | 'theirs-full' | 'edit' | 'launch' | 'recommended' | 'p' | 'mc' | 'tc' | 'mf' | 'tf' | 'e' | 'l' | 'r';
export declare type TShowItem = 'kind' | 'relative-url' | 'repos-root-url' | 'repos-size' | 'revision' | 'last-changed-revision' | 'last-changed-date' | 'last-changed-author' | 'wc-root' | 'schedule' | 'depth' | 'changelist';

export declare interface SVNConfig {
    responsitory?: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
    /**'--non-interactive', '--trust-server-cert', ...etc */
    globalParams?: string[];
}

declare interface RevisionOption {
    /**A revision argument can be one of
     * Number       revision number
     * '{' DATE '}' revision at start of the date
     * 'HEAD'       latest in repository
     * 'BASE'       base rev of item's working copy
     * 'COMMITTED'  last commit at or before BASE
     * 'PREV'       revision just before COMMITTED
     */
    revision?: number | string
}

declare interface QuiteOption {
    /**print nothing, or only summary infomation */
    quiet?: boolean
}

declare interface ChangelistOption {    
    /**operate only on members of changelist */
    changelist?: string[]
}

declare interface DepthOption {
    /**limit operation by depth ('empty', 'files', 'immediates', 'infinity') */
    depth?: TDepth
}

declare interface MessagableOption {
    /**specify lock comment */
    message?: string, 
    /**read lock comment from file */
    file?: string,
    /**force validity of lock comment source */
    forceLog?: boolean,
    /**treat value as being in charset encoding */
    encoding?: string,
}

declare interface WalkOption {
    /**descend recursively, same as --depth=infinity */
    recursive?: boolean,
    /**with {@link verbose}, show file sizes with base-2 unit suffixes (Byte, Kilobyte, Megabyte, Gigabyte, Terabyte and Petabyte), limiting the number of digits to three or less */
    humanReadable?: boolean,
}

declare interface OutputOption {
    /**give output suitable for concatenation */
    incremental?: boolean,
    /**output in XML */
    xml?: boolean
}

export declare type CheckoutOption = {
    /**handle unversioned obstructions as changes */
    force?: boolean,
    /**ignore externals definitions */
    ignoreExternals?: boolean
} & RevisionOption & QuiteOption & DepthOption

export declare type UpdateOption = {
    /**set new working copy depth */
    setDepth?: 'exclude' | TDepth,
    /**use as merge command */
    diff3Cmd?: string,
    /**handle unversioned obstructions as changes */
    force?: boolean,
    /**ignore externals definitions */
    ignoreExternals?: boolean,
    /**use ARG as external editor */
    editorCmd?: string,
    /**specify automatic conflict resolution action */
    accept?: TAccept,
    /**make intermediate directories */
    parents?: boolean,
    /**Local additions are merged with incoming additions instead of causing a tree conflict. Use of this option is not recommended! Use 'svn resolve' to resolve tree conflicts instead*/
    addsAsModification?: boolean
} & DepthOption & QuiteOption & ChangelistOption

export declare type CommitOption = {
    /**don't unlock the targets */
    noUnlock?: boolean,
    /**use ARG as external editor */
    editorCmd?: string,
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string,
    /**don't delete changelists after commit */
    keepChangelists?: boolean,
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean
} & DepthOption & MessagableOption & ChangelistOption

export declare type AddOption = {
    /**ignore already versioned paths */
    force?: boolean,
    /**disregard default and svn:ignore and svn:global-ignores property ignores */
    noIgnore?: boolean,
    /**enable automatic properties */
    autoProps?: boolean,
    /**disable automatic properties */
    noAutoProps?: boolean,
    /**add intermediate parents */
    parents?: boolean
} & DepthOption & QuiteOption

export declare type DeleteOption = {
    /**handle unversioned obstructions as changes */
    force?: boolean,
    /**pass contents of file as additional args */
    targets?: string[],
    /**use ARG as external editor */
    editorCmd?: string,
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string,
    /**keep path in working copy */
    keepLocal?: boolean
} & QuiteOption & MessagableOption

export declare type CopyOption = {
    /**ignore externals definitions */
    ignoreExternals?: boolean,
    /**make intermediate directories */
    parents?: boolean,
    /**use ARG as external editor */
    editorCmd?: string,
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string,
    /**pin externals with no explicit revision to their current revision (recommended when tagging) */
    pinExternals?: boolean
} & RevisionOption & QuiteOption & MessagableOption

export declare type InfoOption = {
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean,
    /**print only the item identified */
    showItem?: TShowItem,
    /**do not output the trailing newline */
    noNewline?: boolean
} & RevisionOption & DepthOption & WalkOption & OutputOption

export declare type StatusOption = {
    /**print extra information */
    verbose?: boolean,
    /**disregard default and svn:ignore and svn:global-ignores property ignores */
    noIgnore?: boolean,
    /**ignore externals definitions */
    ignoreExternals?: boolean
} & DepthOption & RevisionOption & QuiteOption & OutputOption & ChangelistOption

export declare type LogOption = {
    /**the change made in revision */
    change?: string,
    /**print extra information */
    verbose?: boolean,
    /**use/display additional information from merge history */
    useMergeHistory?: boolean,
    /**do not cross copies while trversing history */
    stopOnCopy?: boolean,
    /**maxinum number of log entries */
    limit?: number,
    /**retrieve all revision properties */
    withAllRevprops?: boolean,
    /**retrieve no revision properties */
    withNoRevprops?: boolean,
    /**retrieve revision property */
    withRevprops?: boolean,
    /**use as diff command */
    diffCmd?: string,
    /**override diff-cmd specified in config file */
    internalDiff?: boolean,
    /**use as search pattern (glob syntax, case-and accent-insensitive, may require quotation marks to prevent shell expansion) */
    search?: string[]
} & RevisionOption & QuiteOption & OutputOption & DepthOption

export declare type ListOption = {
    /**print extra information */
    verbose?: boolean,
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean,
    /**use as search pattern (glob syntax, case-and accent-insensitive, may require quotation marks to prevent shell expansion) */
    search?: string
} & RevisionOption & DepthOption & WalkOption & OutputOption

export declare type LockOption = {
    /**steal locks */
    force?: boolean, 
} & MessagableOption & QuiteOption

export declare type UnlockOption = {
    /**steal locks */
    force?: boolean, 
} & QuiteOption

export class SVNClient {
    private text?: string;
    private err?: Error;
    private isRuning = false;

    private cfg?: SVNConfig;
    setConfig(cfg: SVNConfig) {
        this.cfg = cfg;
    }

    async cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio, silent?: boolean): Promise<string> {
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
                if(!this.cfg?.silent && !silent) process.stdout.write(String(data));
                this.text += data;
            })
    
            //执行失败
            proc.stderr.on('data', (data) => {
                if(!this.cfg?.silent && !silent) process.stderr.write(String(data));
                this.err = new Error(String(data));
            })
    
            // 进程错误
            proc.on('error', (error: Error) => {
                if(!this.cfg?.silent && !silent) console.error(error);
                this.isRuning = false;
                reject(error);
            })
    
            // 进程关闭
            proc.on('close', (code: number) => {
                this.isRuning = false;
                if(code == 0) {
                    resolve(this.text || '');
                } else {
                    reject(this.err ?? new Error(`cmd 'svn ${svnParams.join(' ')}' failed, error code: ${code}`));
                }
            })
        });
    }

    async checkout(url?: string | string[], path?: string, option?: CheckoutOption): Promise<string> {
        if(!path) path = this.defaultCWD;

        let params: string[];
        if(typeof(url) === 'string') {
            // 检查是否单个文件
            let infoStr = await this.info(url);
            if(infoStr.includes('Node Kind: file')) {
                // single file
                let nmc = infoStr.match(/Name: (\S+)/);
                let name = nmc![1];
                await this.cmd('co', this.joinUsernameAndPassword([url.substring(0, url.length - name.length), path, '--depth=empty']));
                return this.update(p.join(path, name));
            }
            params = [url];
        } else {
            params = url ? url : [this.cfg?.responsitory!];
        }
        if (path != null) params.push(path);
        if (option != null) {
            this.handleRevisionOption(option, params);
            this.handleQuiteOption(option, params);
            this.handleDepthOption(option, params);
            if (option.force) params.push('--force');
            if (option.ignoreExternals) params.push('--ignore-externals');
        }
        return this.cmd('co', this.joinUsernameAndPassword(params));
    }

    async update(...paths: string[]): Promise<string>;
    async update(paths: string[], option?: UpdateOption): Promise<string>;
    async update(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as UpdateOption;
                this.handleDepthOption(option, svnParams);
                this.handleQuiteOption(option, svnParams);
                this.handleChangelistOption(option, svnParams);
                if (option.setDepth) svnParams.push('--set-depth', option.setDepth);
                if (option.diff3Cmd) svnParams.push('--diff3-cmd', option.diff3Cmd);
                if (option.force) svnParams.push('--force');
                if (option.ignoreExternals) svnParams.push('--ignore-externals');
                if (option.editorCmd) svnParams.push('--editor-cmd', option.editorCmd);
                if (option.accept) svnParams.push('--accept', option.accept);
                if (option.parents) svnParams.push('--parents');
                if (option.addsAsModification) svnParams.push('--adds-as-modification');
            }
            return this.cmd('up', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('up', this.joinUsernameAndPassword(params));
        }
    }

    async commit(msg: string, ...paths: string[]): Promise<string>;
    async commit(paths: string[], option?: CommitOption): Promise<string>;
    async commit(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as CommitOption;
                this.handleDepthOption(option, svnParams);
                this.handleMessagableOption(option, svnParams);
                this.handleChangelistOption(option, svnParams);
                if (option.noUnlock) svnParams.push('--no-unlock');
                if (option.editorCmd) svnParams.push('--editor-cmd', option.editorCmd);
                if (option.withRevprop) svnParams.push('--with-revprop', option.withRevprop);
                if (option.keepChangelists) svnParams.push('--keep-changelists');
                if (option.includeExternals) svnParams.push('--include-externals');
            }
            return this.cmd('add', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('ci', this.joinUsernameAndPassword([...params.slice(1), `-m ${params[0] || 'no message'}`]));
        }
    }

    async add(...paths: string[]): Promise<string>;
    async add(paths: string[], option?: AddOption): Promise<string>;
    async add(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as AddOption;
                this.handleDepthOption(option, svnParams);
                this.handleQuiteOption(option, svnParams);
                if (option.force) svnParams.push('--force');
                if (option.noIgnore) svnParams.push('--no-ignore');
                if (option.autoProps) svnParams.push('--auto-props');
                if (option.noAutoProps) svnParams.push('--no-auto-props');
                if (option.parents) svnParams.push('--parents');
            }
            return this.cmd('add', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('add', this.joinUsernameAndPassword(['--force', '--parents', ...params]));
        }
    }

    async delete(paths: string | string[], option?: DeleteOption): Promise<string> {
        let params: string[];
        if (typeof(paths) === 'string') {
            params = [paths];
        } else {
            params = paths;
        }
        if (option != null) {
            this.handleQuiteOption(option, params);
            this.handleMessagableOption(option, params);
            if (option.force) params.push('--force');
            if (option.targets) params.push('--targets', ...option.targets);
            if (option.editorCmd) params.push('--editor-cmd', option.editorCmd);
            if (option.withRevprop) params.push('--with-revprop', option.withRevprop);
            if (option.keepLocal) params.push('--keep-local');
        }
        return this.cmd('delete', this.joinUsernameAndPassword(params));
    }

    /**
     * use {@link delete} instead.
     * @deprecated 
     */
    async del(msg: string, ...paths: string[]): Promise<string> {
        if(!paths.length) {
            paths = [this.defaultCWD];
        }
        return this.cmd('del', this.joinUsernameAndPassword([`-m ${msg || 'no message'}`, ...paths]));
    }

    async info(...targets: string[]): Promise<string>;
    async info(targets: string[], option?: InfoOption): Promise<string>;
    async info(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as InfoOption;
                this.handleRevisionOption(option, svnParams);
                this.handleWalkOption(option, svnParams);
                this.handleOutputOption(option, svnParams);
                this.handleDepthOption(option, svnParams);
                if (option.includeExternals) svnParams.push('--include-externals');
                if (option.showItem) svnParams.push('--show-item', option.showItem);
                if (option.noNewline) svnParams.push('--no-newline');
            }
            return this.cmd('info', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('info', this.joinUsernameAndPassword(params));
        }
    }

    async status(...paths: string[]): Promise<string>;
    async status(paths: string[], option?: StatusOption): Promise<string>;
    async status(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as StatusOption;
                this.handleRevisionOption(option, svnParams);
                this.handleDepthOption(option, svnParams);
                this.handleQuiteOption(option, svnParams);
                this.handleOutputOption(option, svnParams);
                this.handleChangelistOption(option, svnParams);
                if (option.verbose) svnParams.push('--verbose');
                if (option.noIgnore) svnParams.push('--no-ignore');
                if (option.ignoreExternals) svnParams.push('--ignore-externals');
            }
            return this.cmd('status', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('status', this.joinUsernameAndPassword(params));
        }
    }

    async log(path?: string, ...options: string[]): Promise<string>;
    async log(paths: string[], option?: LogOption): Promise<string>;
    async log(...params: any[]): Promise<string> {
        if (params.length == 0) {
            params = [this.defaultCWD];
        }
        const t0 = typeof(params[0]);
        if (t0 === 'object') {
            const svnParams: string[] = [...params[0]];
            if (params.length == 2) {
                const option = params[1] as LogOption;
                this.handleRevisionOption(option, svnParams);
                this.handleQuiteOption(option, svnParams);
                this.handleOutputOption(option, svnParams);
                this.handleDepthOption(option, svnParams);
                if (option.change) svnParams.push('--change', option.change);
                if (option.verbose) svnParams.push('--verbose');
                if (option.useMergeHistory) svnParams.push('--use-merge-history');
                if (option.stopOnCopy) svnParams.push('--stop-on-copy');
                if (option.limit) svnParams.push('--limit', String(option.limit));
                if (option.withAllRevprops) svnParams.push('--with-all-revprops');
                if (option.withNoRevprops) svnParams.push('--with-no-revprops');
                if (option.withRevprops) svnParams.push('--with-revprops');
                if (option.diffCmd) svnParams.push('--diff-cmd', option.diffCmd);
                if (option.internalDiff) svnParams.push('--internal-diff');
                if (option.search) {
                    svnParams.push('--search');
                    for (let i = 0, len = option.search.length; i < len; i++) {
                        if (i > 0) svnParams.push('--search-and');
                        svnParams.push(option.search[i]);
                    }
                }
            }
            return this.cmd('log', this.joinUsernameAndPassword(svnParams));
        } else {
            return this.cmd('log', this.joinUsernameAndPassword(params));
        }        
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
        let info = await this.cmd('info', this.joinUsernameAndPassword([url!, '--show-item', 'revision']));
        return Number(info);
    }

    async ignore(wcRoot: string, ...ignoreList: string[]): Promise<boolean> {
        if(!ignoreList.length) {
            throw new Error('Nothing to ignore!');
        }
        let lines: string[];
        try {
            let oldIgnore = await this.cmd('propget', ['svn:ignore', wcRoot], undefined, true);
            lines = oldIgnore.split(/\r?\n+/);
        } catch(e) {
            lines = [];
        }
        let changed = false;
        for (let i of ignoreList) {
            if (!lines.includes(i)) {
                lines.push(i);
                changed = true;
            }
        }
        if (!changed) {
            return false;
        }
        const fw = promisify(fs.writeFile);
        const ignoreFile = p.join(wcRoot, `easy-svn@ignore-${Date.now()}.txt`);
        await fw(ignoreFile, lines.join('\n'), );
        await this.cmd('propset', ['svn:ignore', wcRoot, '-F', ignoreFile]);
        const ul = promisify(fs.unlink);
        await ul(ignoreFile);
        return true;
    }

    async copy(src: string, dst: string, option?: CopyOption): Promise<string> {
        const params = [src, dst];
        if (option != null) {
            this.handleRevisionOption(option, params);
            this.handleQuiteOption(option, params);
            this.handleMessagableOption(option, params);
            if (option.parents) params.push('--parents');
            if (option.editorCmd) params.push('--editor-cmd', option.editorCmd);
            if (option.withRevprop) params.push('--with-revprop', option.withRevprop);
            if (option.pinExternals) params.push('--pin-externals');
        }
        return this.cmd('copy', this.joinUsernameAndPassword(params));
    }

    async list(target: string | string[], option?: ListOption): Promise<string> {
        let params: string[];
        if (typeof(target) === 'string') {
            params = [target];
        } else {
            params = target;
        }
        if (option != null) {
            this.handleRevisionOption(option, params);
            this.handleWalkOption(option, params);
            this.handleOutputOption(option, params);
            if (option.verbose) params.push('--verbose');
            if (option.depth) params.push('--depth', option.depth);
            if (option.includeExternals) params.push('--include-externals');
            if (option.search) params.push('--search', option.search);
        }
        return this.cmd('list', this.joinUsernameAndPassword(params));
    }

    async lock(target: string | string[], option?: LockOption): Promise<string> {
        let params: string[];
        if (typeof(target) === 'string') {
            params = [target];
        } else {
            params = target;
        }
        if (option != null) {
            this.handleMessagableOption(option, params);
            this.handleQuiteOption(option, params);
            if (option.force) params.push('--force');
        }
        return this.cmd('lock', this.joinUsernameAndPassword(params));
    }

    async unlock(target: string | string[], option?: UnlockOption): Promise<string> {
        let params: string[];
        if (typeof(target) === 'string') {
            params = [target];
        } else {
            params = target;
        }
        if (option != null) {
            this.handleQuiteOption(option, params);
            if (option.force) params.push('--force');
        }
        return this.cmd('unlock', this.joinUsernameAndPassword(params));
    }

    private handleRevisionOption(option: RevisionOption, params: string[]): void {
        if (option.revision) params.push('-r', String(option.revision));
    }

    private handleWalkOption(option: WalkOption, params: string[]): void {
        if (option.recursive) params.push('--recursive');
        if (option.humanReadable) params.push('--human-readable');
    }

    private handleOutputOption(option: OutputOption, params: string[]): void {
        if (option.incremental) params.push('--incremental');
        if (option.xml) params.push('--xml');
    }

    private handleMessagableOption(option: MessagableOption, params: string[]): void {
        if (option.message) params.push('-m', option.message);
        if (option.file) params.push('-F', option.file);
        if (option.forceLog) params.push('--force-log');
        if (option.encoding) params.push('--encoding', option.encoding);
    }

    private handleDepthOption(option: DepthOption, params: string[]): void {
        if (option.depth) params.push('--depth', option.depth);
    }

    private handleQuiteOption(option: QuiteOption, params: string[]): void {
        if (option.quiet) params.push('--quiet');
    }

    private handleChangelistOption(option: ChangelistOption, params: string[]): void {
        if (option.changelist) params.push('--changelist', ...option.changelist);
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