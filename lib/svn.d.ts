/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'child_process';
export interface SVNConfig {
    responsitory: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
}
export declare class SVNClient {
    private cfg;
    private text?;
    private err?;
    private isRuning;
    constructor(cfg: SVNConfig);
    cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string>;
    checkout(): Promise<string>;
    update(): Promise<string>;
    commit(msg: string): Promise<string>;
    add(paths: string[]): Promise<string>;
    del(paths: string[], msg: string): Promise<string>;
    info(): Promise<string>;
    status(): Promise<string>;
    log(): Promise<string>;
    revert(): Promise<string>;
    /**
     *
     * @param rmUnversioned CollabNetSubversion-client should be great than 1.9.0
     * @returns
     */
    cleanup(rmUnversioned?: boolean): Promise<string>;
    addUnversioned(): Promise<string>;
}
