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
await svn.cleanup();  // cleanup E:/your-svn-workspace
await svn.cleanup(true, 'E:/foo');  // cleanup E:/foo
await svn.revert();  // revert E:/your-svn-workspace
await svn.revert('E:/foo', 'E:/bar');  // revert E:/foo & E:/bar
await svn.update();  // update E:/your-svn-workspace
await svn.addUnversioned('.');  // add unversioned files in .
await svn.checkout('svn://your-svn-responsitory/some-folder');  // check out into some-folder
await svn.checkout('svn://your-svn-responsitory/some-folder', 'the-specified-folder');  // check out into a specified folder
// you can also checkout a s single file, like:
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
checkout(url?: string, path?: string): Promise<string>;
```

# update

```Typescript
update(...paths: string[]): Promise<string>;
```

# commit

```Typescript
commit(msg: string, ...paths: string[]): Promise<string>;
```

# add

```Typescript
add(...paths: string[]): Promise<string>;
```

# del

```Typescript
del(msg: string, ...paths: string[]): Promise<string>;
```

# info

```Typescript
info(...targets: string[]): Promise<string>;
```

# status

```Typescript
status(...paths: string[]): Promise<string>;
```

# log

```Typescript
log(path?: string): Promise<string>;
```

# revert

```Typescript
revert(...paths: string[]): Promise<string>;
```

# cleanup

```Typescript
cleanup(rmUnversioned?: boolean, ...wcpaths: string[]): Promise<string>;
```

# addUnversioned

```Typescript
addUnversioned(...paths: string[]): Promise<string>;
```

# getRevision

```Typescript
async getRevision(url?: string): Promise<number>;
```