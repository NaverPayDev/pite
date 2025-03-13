# `@naverpay/pite`

> lang: En | [Ko](./README.ko.md)

A Vite bundler configuration package that supports library builds with minimal setup.

## Why pite?

[`vite`](https://github.com/vitejs/vite) has become a versatile build tool supporting various frameworks beyond Vue.js, including React. It also provides a Library Mode for bundling libraries, making it a strong alternative to Rollup. With its fast build speed and optimized bundling environment, it is gaining popularity as a package bundler.

However, **without prior knowledge of core concepts and configuration methods for library builds, setting up an efficient configuration file can be challenging.** To effectively utilize Vite’s Library Mode, multiple factors must be considered.

[`tsup`](https://github.com/egoist/tsup) is an esbuild-based bundler that simplifies bundling TypeScript libraries. It is useful for basic bundling tasks. However, **it does not provide automatic polyfill insertion or transpilation based on `browserslist`, meaning additional tools or configurations may be required for an optimized build in specific environments.** Additionally, since it is based on esbuild, it lacks compatibility with Rollup plugins, limiting access to Rollup’s extensive plugin ecosystem.

To address these limitations, **pite provides a more intuitive and flexible library build environment.**
While maintaining the strengths of both `vite` and `tsup`, pite offers presets that enable seamless configuration for various environments, allowing stable library builds without complex setup.

## Features

### Supports Dual Package Builds

- Supports both ESM and CJS formats, with the option to generate ESM-only builds.
- Allows specifying subpaths using glob patterns.
- Enables defining separate output paths for different module systems.

### `browserslist`-based Transpilation

- Utilizes [browserslist-to-esbuild](https://github.com/marcofugaro/browserslist-to-esbuild#readme) to read `.browserslistrc` and convert it into an `esbuild`-compatible `target` format. This allows automatic optimization based on the `.browserslistrc` in the consuming project without manually configuring build targets.
- Performs transpilation based on `browserslist`, ensuring the output matches the specified browser environment.
- If no configuration is provided, it defaults to [`@naverpay/browserslist-config`](https://github.com/NaverPayDev/browserslist-config#readme).

> 📦 [`@naverpay/browserslist-config`](https://github.com/NaverPayDev/browserslist-config#readme)  
>
> A Shareable Browserslist Config package that reflects [Naver Pay’s supported browser range](https://browsersl.ist/#q=%3E0.2%25%2Cnot+dead%2Cnot+op_mini+all%2Cnot+ie%3E%3D0%2Cnot+ios_saf%3C15%2Cios_saf%3E%3D15%2Cnode%3E%3D18.18.0%2CChrome%3E%3D106&region=KR).

### Automatic Polyfill Detection & Optimization Based on `browserslist`

- If a `.browserslistrc` file is present, pite automatically detects whether polyfills are required and provides guidance.
- When polyfills are needed, it injects them using the [runtime](https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers) method to prevent redundant code and optimize package size.
- Supports [core-js-pure (3.39.0)](https://github.com/babel/babel-polyfills/tree/main/packages/babel-plugin-polyfill-corejs3) to apply polyfills safely without polluting the global environment.

### Best Practices for Library Builds

- Analyzes the entry path of the library and provides recommendations for an optimal directory structure.
- Supports `preserveModules` and `preserveDirectives` by default:
  - `preserveModules`: Maintains the original source directory structure when bundling. This allows direct imports of individual modules and enhances tree shaking.
  - `preserveDirectives`: Preserves directives like `'use client'` in the bundling process to ensure expected behavior in specific runtime environments.
- Automatically excludes external dependencies (`dependencies`, `peerDependencies`) in `package.json` to prevent unnecessary code from being bundled.  
If a package installed in `devDependencies` is executed within the project, it will not be treated as an external dependency and will be included in the bundle. If a package needs to be included in the bundle, it is appropriate to specify it in `dependencies` or `peerDependencies`. Please list only packages that are used exclusively in the development environment under `devDependencies`.
- While best practices are provided by default, pite offers flexible build options that can be adjusted to meet project-specific requirements.

### Build Validation with `publint`

- Runs `verifyPackageJSON` from `@naverpay/publint` before the build process to check if critical `package.json` fields for publishing (e.g., `main`, `files`) are correctly defined.
- Executes the `publint` API after the build to verify that `package.json` fields like `main` and `exports` are correctly set and that no required files are missing.

> 📦 [`publint`](https://publint.dev/docs/)
>
> publint is an npm package linter that ensures optimal compatibility with Vite, Rollup, and other environments.
>
> 📦 [`@naverpay/publint`](https://github.com/NaverPayDev/cli/tree/main/packages/publint)  
>
> A package inspired by publint, designed to enforce best practices specific to Naver Pay’s internal standards.

### Setting Up a TypeScript Build Environment Using the Custom `vite-tsup-plugin`

- This is a Vite plugin built using the tsup API.
- Allows projects to set up a build environment without requiring additional `tsup` configurations.
- Generates `.d.ts` declaration files for both ESM and CJS builds, ensuring consistent type information across different environments.
- Provides a plugin for executing `tsup` commands to ensure stable type declaration file generation, addressing [`vite-plugin-dts` module resolution issues](https://github.com/NaverPayDev/pite/issues/27).
- Unlike standalone `tsup`, which does not support Rollup plugins, using pite allows access to the full Rollup plugin ecosystem.
- This plugin is not published and is intended for internal project use only.

## Install

Run the following command to install as a `devDependencies`:

```sh
npm install --save-dev @naverpay/pite
```

Or, if using `pnpm`:

```sh
pnpm add -D @naverpay/pite
```

## Requirements

```
node: >=18
vite: >=6.0.10
tsup: >=8.3.5
```

## How to use

### 1️⃣ Create a Vite Configuration File

Import `createViteConfig` in `vite.config.ts` and set up the configuration.

```ts
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: process.cwd(),
    entry: ['src/index.ts'],
    outputs: [
        { format: 'es', dist: 'dist/es' },
        { format: 'cjs', dist: 'dist/cjs' },
    ],
    cssFileName: 'style.css',
    visualize: true,
    publint: {severity: 'error'},
    includeRequiredPolyfill: ['fetch', 'Promise'],
    skipRequiredPolyfillCheck: ['Symbol'],
    options: {
        minify: true,
        sourcemap: true,
    },
})
```

### 2️⃣ Build the Library

Run the following command to bundle the library:

```sh
vite build
```

Once the build is complete, the bundled files will be generated in the `dist/es` and `dist/cjs` directories.

## Options

| Option Name                | Type                                                    | Description                                         |
|----------------------------|---------------------------------------------------------|-----------------------------------------------------|
| *`entry`                    | `string` \| `string[]` \| `Record<string, string>`      | Entry file path (supports glob patterns)           |
| `cwd`                      | `string`                                                | Current working directory (default: `'.'`)         |
| `outputs`                  | `{ format: 'es' \| 'cjs'; dist: string }[]`             | Specifies module format and output directory       |
| `cssFileName`              | `string`                                                | Output CSS file name                               |
| `visualize`                | `boolean` \| [`PluginVisualizerOptions`](https://github.com/btd/rollup-plugin-visualizer?tab=readme-ov-file#options) | Enables [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer) |
| `publint`                  | `{ severity?: 'error' \| 'warn' \| 'off' }`             | Specifies severity for publint checks<br />(`error`: exit with code 1, `warn`: show warnings only, `off`: disable check) |
| `includeRequiredPolyfill`  | `string[]`                                              | List of required polyfills to be injected          |
| `skipRequiredPolyfillCheck`| `string[]`                                              | List of polyfills to skip injection check         |
| `options`                  | [`BuildOptions`](https://vite.dev/config/build-options) | Additional Vite build options                     |

### `includeRequiredPolyfill` vs `skipRequiredPolyfillCheck`

By default, `pite` detects code that requires polyfills based on the project's `browserslist` and raises an error if necessary. This ensures that the library functions correctly across different environments while preventing unnecessary polyfill injections that may increase build size.

The `includeRequiredPolyfill` and `skipRequiredPolyfillCheck` options allow you to adjust the polyfill injection criteria and processing behavior. These options provide flexibility in applying polyfills based on project requirements.

- `includeRequiredPolyfill` allows explicit inclusion of polyfills deemed necessary for the library’s functionality. By specifying the required polyfills, they will be automatically included to ensure proper execution. These polyfills are applied at runtime and are not bundled directly within the library. Therefore, `core-js-pure@3.x` must be installed as a dependency.
- `skipRequiredPolyfillCheck` prevents errors from being raised even if certain polyfills are detected as necessary. This option is useful when the library does not require specific polyfills, despite automated detection indicating otherwise.  
`core-js` not only detects missing features in target environments, but it also inserts polyfills for proposal-stage features, features with reported bugs in specific browser versions, newly introduced extensions to existing features, and cases where JavaScript’s dynamic nature makes it difficult to accurately determine the presence of prototype methods.  
This behavior may lead to unnecessary polyfills being added, which can differ from a developer’s intent to simply complement browser support. To prevent this, you can use the `skipRequiredPolyfillCheck` option to exclude certain polyfills. By carefully controlling this option, you can optimize the overall package size.  
However, **if a feature genuinely falls outside the supported browser range and requires a polyfill**, issues may arise, so use this option with caution.  
(See [example packages](#example-packages) that use the `skipRequiredPolyfillCheck` option.)

## Example Packages

Check out the configurations and build outputs of example libraries built using `pite`.

### [`@naverpay/hidash`](https://github.com/NaverPayDev/hidash/tree/main)

- [Go to config](https://github.com/NaverPayDev/hidash/blob/main/vite.config.mts)
- [unpkg `@naverpay/hidash`](https://www.unpkg.com/browse/@naverpay/hidash@latest/)

```js
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: '.',
    entry: ['!./src/**/*.bench.ts', '!./src/**/*.test.ts', './src/**/*.ts'],
    outputs: [
        {
            format: 'cjs',
            dist: 'dist',
        },
        {
            format: 'es',
            dist: 'dist',
        },
    ],
    skipRequiredPolyfillCheck: [
        // https://bugs.chromium.org/p/v8/issues/detail?id=12681
        'es.array.push',
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1767541
        'es.array.includes',
        // https://issues.chromium.org/issues/40672866
        'es.array.reduce',
        // https://github.com/zloirock/core-js/issues/480#issuecomment-457494016 safari bug
        'es.string.trim', 
        // https://github.com/zloirock/core-js/commit/9017066b4cb367c6609e4473d43d6e6dad8031a5#diff-59f90be4cf68f9d13d2dce1818780ae968bf48328da4014b47138adf527ec0fcR1066
        'es.regexp.flags', 
        // https://bugs.webkit.org/show_bug.cgi?id=188794
        'es.array.reverse', 
    ],
})
```

### [`@naverpay/vanilla-store`](https://github.com/NaverPayDev/pie/tree/main/packages/vanilla-store)

- [Go to config](https://github.com/NaverPayDev/pie/blob/main/packages/vanilla-store/vite.config.mjs)
- [unpkg `@naverpay/vanilla-store`](https://www.unpkg.com/browse/@naverpay/vanilla-store@latest/)

```js
import { createViteConfig } from '@naverpay/pite'

export default createViteConfig({
    cwd: '.',
    entry: ['./src/index.ts'],
    skipRequiredPolyfillCheck: [
        'esnext.json.parse'
    ],
    options: {
        minify: false,
    },
})
```

## License

MIT License © 2025 NaverPay
