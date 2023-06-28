# easy-svn
Make it easy to use svn in nodejs.

# Install

First, make sure a command SVN has been installed, such as CollabNetSunversion.

Then~

`npm i @taiyosen/easy-svn`

# How to use

```Typescript
let svn = new SVNClient();
// config is optional.
svn.setConfig({
    responsitory: 'svn://your-svn-responsitory', 
    username: 'your-svn-username', 
    password: 'your-svn-password', 
    cwd: 'E:/your-svn-workspace', 
    silent: true
});
await svn.log('.', '-r', 'BASE:HEAD', '-v');  // show the log messages for any incoming changes
await svn.cleanup();  // cleanup E:/your-svn-workspace
await svn.cleanup(true, 'E:/foo');  // cleanup E:/foo
await svn.revert();  // revert E:/your-svn-workspace
await svn.revert('E:/foo', 'E:/bar');  // revert E:/foo & E:/bar
await svn.update();  // update E:/your-svn-workspace
await svn.addUnversioned('.');  // add unversioned files in .
await svn.checkout('svn://your-svn-responsitory/some-folder');  // check out into some-folder
await svn.checkout('svn://your-svn-responsitory/some-folder', 'the-specified-folder');  // check out into a specified folder
// you can also checkout a single file, like:
await svn.checkout('svn://your-svn-responsitory/some-folder/some-file.ts');
```

# Set a default configuration

* [responsitory] - works if no url given when calling `checkout`
* [username] - `--username` option will be enabled
* [password] - `--password` option will be enabled
* [cwd] - works as the default path when calling `checkout`/`update`/`commit`/...
* [silent] - no log or error details if set true

```Typescript
SVNConfig {
    responsitory?: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
}
```

# Check out 

```Typescript
async checkout(url?: string | string[], path?: string, option?: CheckoutOption): Promise<string>;
```

# update

```Typescript
async update(paths: string[], option?: UpdateOption): Promise<string>;
/**@deprecated */
async update(...paths: string[]): Promise<string>;
```

# commit

```Typescript
async commit(paths: string[], option?: CommitOption): Promise<string>;
/**@deprecated */
async commit(msg: string, ...paths: string[]): Promise<string>;
```

# add

```Typescript
async add(paths: string[], option?: AddOption): Promise<string>;
/**@deprecated */
async add(...paths: string[]): Promise<string>;
```

# del

```Typescript
async delete(paths: string | string[], option?: DeleteOption): Promise<string>;
/**@deprecated */
async del(msg: string, ...paths: string[]): Promise<string>;
```

# info

```Typescript
async info(targets: string[], option?: InfoOption): Promise<string>;
/**@deprecated */
async info(...targets: string[]): Promise<string>;
```

# status

```Typescript
async status(paths: string[], option?: StatusOption): Promise<string>;
/**@deprecated */
async status(...paths: string[]): Promise<string>;
```

# log

```Typescript
async log(paths: string[], option?: LogOption): Promise<string>;
/**@deprecated */
async log(path?: string, ...options: string[]): Promise<string>;
```

# revert

```Typescript
async revert(...paths: string[]): Promise<string>;
```

# cleanup

```Typescript
async cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string>;
```

# addUnversioned

```Typescript
async addUnversioned(...paths: string[]): Promise<string>;
```

# getRevision

```Typescript
async getRevision(url?: string): Promise<number>;
```

# ignore

```Typescript
async ignore(wcRoot: string, ...ignoreList: string[]): Promise<boolean>;
```

# copy

```Typescript
async copy(src: string, dst: string, option?: CopyOption): Promise<string>;
```

# list

```Typescript
async list(target: string | string[], option?: ListOption): Promise<string>
```

# lock

```Typescript
async lock(target: string | string[], option?: LockOption): Promise<string>
```

# unlock

```Typescript
async unlock(target: string | string[], option?: UnlockOption): Promise<string>
```

# any command

```Typescript
async cmd(command: string, params?: string[], options?: SpawnOptionsWithoutStdio): Promise<string>
```

for example:
```Typescript
import { SVNClient } from "@taiyosen/easy-svn";

const svn = new SVNClient();
await svn.cmd('add', ['--force', '--parents', '--no-ignore', '.']);
```