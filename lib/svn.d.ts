/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
export interface SVNConfig {
    responsitory?: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
}
export declare class SVNClient {
    private text?;
    private err?;
    private isRuning;
    private cfg?;
    setConfig(cfg: SVNConfig): void;
    cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string>;
    checkout(url: string, path?: string): Promise<string>;
    update(...paths: string[]): Promise<string>;
    commit(msg: string, ...paths: string[]): Promise<string>;
    add(...paths: string[]): Promise<string>;
    del(msg: string, ...paths: string[]): Promise<string>;
    info(...targets: string[]): Promise<string>;
    status(...paths: string[]): Promise<string>;
    log(path?: string): Promise<string>;
    revert(...paths: string[]): Promise<string>;
    /**
     *
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns
     */
    cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string>;
    addUnversioned(...paths: string[]): Promise<string>;
    private get defaultCWD();
}
