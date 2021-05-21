# easy-svn
Make svn easy to used in nodejs.

# Install

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
await svn.cleanup();
await svn.cleanup(true, 'E:/foo');
await svn.revert();
await svn.revert('E:/foo', 'E:/bar');
await svn.update();
await svn.addUnversioned('.');
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