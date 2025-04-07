# Esm only + No Barrel

This is a Node.js project that supports only ESM.  
Since there are no barrel files, modules can only be accessed via subpath imports.

## Setup

```
cd example/esm-only+no-barrel
pnpm i
pnpm run build
```

## Features

- This is a Node.js project that supports only ESM
- No barrel files are provided
- Due to the absence of a barrel file (e.g., index.js), the `main`, `module`, and `types` fields in `package.json` are left empty
- As a result, publint reports errors, so the `severity` option is set to warn to suppress them
