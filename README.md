# easy-svn
Make svn easy to used in nodejs.

# How to use

```Typescript
let svn = new SVNClient({
    cwd: 'E:/your-svn-workspace',
    responsitory: 'svn://your-svn-responsitory'
});
await svn.cleanup(true);
await svn.revert();
await svn.update();
```

# New a SVNClient instance

The constructor of SVNClient requires an object described below:

```Typescript
SVNConfig {
    responsitory: string;
    username?: string;
    password?: string;
    cwd?: string;
    silent?: boolean;
}
```

# Check out 

```Typescript
checkout(): Promise<string>;
```

# update

```Typescript
update(): Promise<string>;
```

# commit

```Typescript
commit(msg: string): Promise<string>;
```

# add

```Typescript
add(paths: string[]): Promise<string>;
```

# del

```Typescript
del(paths: string[], msg: string): Promise<string>;
```

# info

```Typescript
info(): Promise<string>;
```

# status

```Typescript
status(): Promise<string>;
```

# log

```Typescript
log(): Promise<string>;
```

# revert

```Typescript
revert(): Promise<string>;
```