# `@naverpay/pite`

`@naverpay/pite` is a Vite bundler configuration package designed for building JavaScript and TypeScript libraries efficiently. It provides an optimized Vite configuration with support for multiple module formats (`ESM` and `CJS`), external dependency handling, and polyfill management.

## Features

- 📦 **Supports multiple formats**: Builds `ESM` (`.mjs`) and `CJS` (`.js`) modules.
- 🚀 **Optimized for library development**: Uses `Vite` with `Rollup` for bundling.
- 🎯 **Targeted transpilation**: Leverages `browserslist` for precise ES build targets.
- 🔄 **Automatic polyfill injection**: Supports `core-js-pure` polyfills with intelligent injection.
- 🔧 **Customizable configurations**: Allows overriding build options and external dependencies.
- 🏗 **Preserves module structures**: Keeps `preserveModules` for optimal tree-shaking.
- 🔍 **Build validation**: Uses `publint` to verify configuration and output before and after build.

## Installation

Install `@naverpay/pite` as a development dependency:

```sh
npm install --save-dev @naverpay/pite
```

or using `pnpm`:

```sh
pnpm add -D @naverpay/pite
```

## Usage

### 1. Create a Vite Config File

In your `vite.config.ts`, import and use `createViteConfig`:

```ts
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: process.cwd(), // Set working directory
    entry: ['src/index.ts'], // Entry files
    outputs: [
        { format: 'es', dist: 'dist/es' }, // ESM output directory
        { format: 'cjs', dist: 'dist/cjs' }, // CJS output directory
    ],
    cssFileName: 'style.css', // CSS file output name
    allowedPolyfills: ['fetch', 'Promise'], // Specify allowed polyfills
    ignoredPolyfills: ['Symbol'], // Specify ignored polyfills
    options: {
        minify: true, // Minification option
        sourcemap: true, // Enable sourcemaps
    },
})
```

### 2. Build Your Library

Run the following command to bundle your library:

```sh
vite build
```

This will generate the output files in the `dist/es` and `dist/cjs` directories.

## Configuration Options

| Option               | Type                                       | Description |
|----------------------|------------------------------------------|-------------|
| `cwd`               | `string`                                  | The current working directory (default: `'.'`). |
| `entry`             | `string[]`                                | The entry file(s) for the library (supports glob patterns). |
| `outputs`           | `{format: 'es' \| 'cjs'; dist: string}[]` | Specifies the output formats and their respective directories. |
| `cssFileName`       | `string`                                  | The name of the output CSS file. |
| `allowedPolyfills`  | `string[]`                                | List of allowed polyfills for injection.<br />(Polyfills are included at runtime in the build) |
| `ignoredPolyfills`  | `string[]`                                | List of ignored polyfills<br />(Builds without polyfills, ignoring errors; mainly used to exclude rarely used modern specs) |
| `options`           | `BuildOptions`                            | Additional Vite build options. |

## 🎉 Why use pite?

### Limitations of vite/tsup

- Setting up Vite for library bundling can be complex if you have no prior experience.
- Managing multiple libraries requires repeated bundling configurations.
- `browserslist` does not natively determine necessary polyfills, requiring additional setup.
- Using vite with [tsup](https://github.com/egoist/tsup) requires extra configuration.
- When using tsup alone, it relies on esbuild, limiting access to the rich ecosystem of rollup plugins.

> `@naverpay/pite` provides a standardized Vite config preset for library development.

### Dual package build support

- Supports both ESM and CJS formats.
- Allows subpath specification using glob patterns.
- Configurable output paths for each module system.

### `browserslist`-based transpilation

- Uses `.browserslistrc` from the consuming project for transpilation.
- If not specified, it follows [NaverPay's recommended configuration (@naverpay/browserslist-config)](https://github.com/NaverPayDev/browserslist-config#readme).

### Automatic polyfill detection and optimization

- Detects the need for polyfills based on `browserslist`.
- Injects necessary polyfills at runtime using [`@rollup/plugin-babel`](https://github.com/rollup/plugins/tree/master/packages/babel) and [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime).
- Supports `core-js-pure`, ensuring no global pollution.

### Best practices for library builds

- Includes entry path validation to enforce optimal directory structures.
- Supports `preserveModules` and `preserveDirectives`.
- Automatically detects external dependencies from `package.json` and excludes them from bundling.
  - Excludes `dependencies`, `peerDependencies`, etc., by default.

### Build validation with `publint`

- Verifies `package.json` structure before build.
- Checks the integrity of the build output after bundling.

### Built-in `vite-tsup-plugin`

- Works out-of-the-box with no additional tsup configuration.
- Generates `.d.ts` declaration files for both ESM and CJS.
- Resolves [`vite-plugin-dts` module resolution issues](https://github.com/NaverPayDev/pite/issues/27).
- Allows the use of rollup plugins, unlike pure tsup-based builds.

## 🤖 How pite works

### Transpilation & polyfill handling

- Uses [browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild#readme) to read `browserslist` and convert it to esbuild targets.
- Determines necessary transpilation and polyfills based on `browserslist`.
- Injects `core-js-pure (3.39.0)` polyfills at runtime with [`@rollup/plugin-babel`](https://github.com/rollup/plugins) and [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/babel-plugin-transform-runtime).

### TypeScript file handling

- Runs tsup via a custom `vite-tsup-plugin` to generate declaration files.

### Build result validation

- Uses a custom `rollup-plugin-publint` to check `package.json` structure before build and validate output integrity after build.

## License

MIT License © 2025 NaverPay
