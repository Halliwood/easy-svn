/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
export declare type TDepth = 'empty' | 'files' | 'immediates' | 'infinity';
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
    revision?: number | string;
}
declare interface QuiteOption {
    /**print nothing, or only summary infomation */
    quiet?: boolean;
}
declare interface ChangelistOption {
    /**operate only on members of changelist */
    changelist?: string[];
}
declare interface DepthOption {
    /**limit operation by depth ('empty', 'files', 'immediates', 'infinity') */
    depth?: TDepth;
}
declare interface MessagableOption {
    /**specify lock comment */
    message?: string;
    /**read lock comment from file */
    file?: string;
    /**force validity of lock comment source */
    forceLog?: boolean;
    /**treat value as being in charset encoding */
    encoding?: string;
}
declare interface WalkOption {
    /**descend recursively, same as --depth=infinity */
    recursive?: boolean;
    /**with {@link verbose}, show file sizes with base-2 unit suffixes (Byte, Kilobyte, Megabyte, Gigabyte, Terabyte and Petabyte), limiting the number of digits to three or less */
    humanReadable?: boolean;
}
declare interface OutputOption {
    /**give output suitable for concatenation */
    incremental?: boolean;
    /**output in XML */
    xml?: boolean;
}
export declare type CheckoutOption = {
    /**handle unversioned obstructions as changes */
    force?: boolean;
    /**ignore externals definitions */
    ignoreExternals?: boolean;
} & RevisionOption & QuiteOption & DepthOption;
export declare type UpdateOption = {
    /**set new working copy depth */
    setDepth?: 'exclude' | TDepth;
    /**use as merge command */
    diff3Cmd?: string;
    /**handle unversioned obstructions as changes */
    force?: boolean;
    /**ignore externals definitions */
    ignoreExternals?: boolean;
    /**use ARG as external editor */
    editorCmd?: string;
    /**specify automatic conflict resolution action */
    accept?: TAccept;
    /**make intermediate directories */
    parents?: boolean;
    /**Local additions are merged with incoming additions instead of causing a tree conflict. Use of this option is not recommended! Use 'svn resolve' to resolve tree conflicts instead*/
    addsAsModification?: boolean;
} & DepthOption & QuiteOption & ChangelistOption;
export declare type CommitOption = {
    /**don't unlock the targets */
    noUnlock?: boolean;
    /**use ARG as external editor */
    editorCmd?: string;
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string;
    /**don't delete changelists after commit */
    keepChangelists?: boolean;
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean;
} & DepthOption & MessagableOption & ChangelistOption;
export declare type AddOption = {
    /**ignore already versioned paths */
    force?: boolean;
    /**disregard default and svn:ignore and svn:global-ignores property ignores */
    noIgnore?: boolean;
    /**enable automatic properties */
    autoProps: boolean;
    /**disable automatic properties */
    noAutoProps: boolean;
    /**add intermediate parents */
    parents?: boolean;
} & DepthOption & QuiteOption;
export declare type DeleteOption = {
    /**handle unversioned obstructions as changes */
    force?: boolean;
    /**pass contents of file as additional args */
    targets?: string;
    /**use ARG as external editor */
    editorCmd: string;
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string;
    /**keep path in working copy */
    keepLocal?: boolean;
} & QuiteOption & MessagableOption;
export declare type CopyOption = {
    /**ignore externals definitions */
    ignoreExternals?: boolean;
    /**make intermediate directories */
    parents?: boolean;
    /**use ARG as external editor */
    editorCmd: string;
    /**set revision property ARG in new revision, using the name[=value] format*/
    withRevprop?: string;
    /**pin externals with no explicit revision to their current revision (recommended when tagging) */
    pinExternals?: boolean;
} & RevisionOption & QuiteOption & MessagableOption;
export declare type InfoOption = {
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean;
    /**print only the item identified */
    showItem?: TShowItem;
    /**do not output the trailing newline */
    noNewline?: boolean;
} & RevisionOption & DepthOption & WalkOption & OutputOption;
export declare type StatusOption = {
    /**print extra information */
    verbose?: boolean;
    /**disregard default and svn:ignore and svn:global-ignores property ignores */
    noIgnore?: boolean;
    /**ignore externals definitions */
    ignoreExternals?: boolean;
} & DepthOption & RevisionOption & QuiteOption & OutputOption & ChangelistOption;
export declare type LogOption = {
    /**the change made in revision */
    change?: string;
    /**print extra information */
    verbose?: boolean;
    /**use/display additional information from merge history */
    useMergeHistory?: boolean;
    /**do not cross copies while trversing history */
    stopOnCopy?: boolean;
    /**maxinum number of log entries */
    limit?: number;
    /**retrieve all revision properties */
    withAllRevprops?: boolean;
    /**retrieve no revision properties */
    withNoRevprops?: boolean;
    /**retrieve revision property */
    withRevprops?: boolean;
    /**use as diff command */
    diffCmd?: string;
    /**override diff-cmd specified in config file */
    internalDiff?: boolean;
    /**use as search pattern (glob syntax, case-and accent-insensitive, may require quotation marks to prevent shell expansion) */
    search?: string[];
} & RevisionOption & QuiteOption & OutputOption & DepthOption;
export declare type ListOption = {
    /**print extra information */
    verbose?: boolean;
    /**also operate on externals defined by svn:externals properties */
    includeExternals?: boolean;
    /**use as search pattern (glob syntax, case-and accent-insensitive, may require quotation marks to prevent shell expansion) */
    search?: string;
} & RevisionOption & DepthOption & WalkOption & OutputOption;
export declare type LockOption = {
    /**steal locks */
    force?: boolean;
} & MessagableOption & QuiteOption;
export declare type UnlockOption = {
    /**steal locks */
    force?: boolean;
} & QuiteOption;
export declare class SVNClient {
    private text?;
    private err?;
    private isRuning;
    private cfg?;
    setConfig(cfg: SVNConfig): void;
    cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string>;
    checkout(url?: string | string[], path?: string, option?: CheckoutOption): Promise<string>;
    update(...paths: string[]): Promise<string>;
    update(paths: string[], option?: UpdateOption): Promise<string>;
    commit(msg: string, ...paths: string[]): Promise<string>;
    commit(paths: string[], option?: CommitOption): Promise<string>;
    add(...paths: string[]): Promise<string>;
    add(paths: string[], option?: AddOption): Promise<string>;
    delete(paths: string | string[], option?: DeleteOption): Promise<string>;
    /**
     * use {@link delete} instead.
     * @deprecated
     */
    del(msg: string, ...paths: string[]): Promise<string>;
    info(...targets: string[]): Promise<string>;
    info(targets: string[], option?: InfoOption): Promise<string>;
    status(...paths: string[]): Promise<string>;
    status(paths: string[], option?: StatusOption): Promise<string>;
    log(path?: string, ...options: string[]): Promise<string>;
    log(paths: string[], option?: LogOption): Promise<string>;
    revert(...paths: string[]): Promise<string>;
    /**
     *
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns
     */
    cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string>;
    addUnversioned(...paths: string[]): Promise<string>;
    getRevision(url?: string): Promise<number>;
    ignore(wcRoot: string, ...ignoreList: string[]): Promise<boolean>;
    copy(src: string, dst: string, option?: CopyOption): Promise<string>;
    list(target: string | string[], option?: ListOption): Promise<string>;
    lock(target: string | string[], option?: LockOption): Promise<string>;
    unlock(target: string | string[], option?: UnlockOption): Promise<string>;
    private handleRevisionOption;
    private handleWalkOption;
    private handleOutputOption;
    private handleMessagableOption;
    private handleDepthOption;
    private handleQuiteOption;
    private handleChangelistOption;
    private joinUsernameAndPassword;
    private get defaultCWD();
}
export {};
