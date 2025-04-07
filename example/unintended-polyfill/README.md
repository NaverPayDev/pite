# Unintended polyfill

This reproduces a scenario where polyfills are unintentionally included.

## Setup

```
cd example/unintended-polyfill
pnpm i
pnpm run build
```

## How to Reproduce

As an example, [here](./src/parseJson.ts) is a piece of code that uses `JSON.parse`,  
and it may unintentionally trigger the inclusion of a polyfill.  

Here's how you can reproduce the issue where polyfills are unintentionally added:

```diff
// vite.config.js

export default createViteConfig({
    ...
-   skipRequiredPolyfillCheck: ['esnext.json.parse'],
})
```

If `skipRequiredPolyfillCheck` is removed, the build process will fail with an error message in the terminal.

```
[Polyfill Injection Required] esnext.json.parse

To use this polyfill, please do one of the following:
1. Add it to 'includeRequiredPolyfill' to allow injection.
2. Add it to 'skipRequiredPolyfillCheck' to skip the verification.

After making the necessary changes, try building again.

⚠️ Note: Polyfills will not be added automatically. Any errors due to unsupported methods in certain browsers or environments will be the responsibility of the package user.
(core-js adds polyfills even for specific browser bugs, so carefully consider whether a polyfill is truly necessary.)
```

If you add the `includeRequiredPolyfill` option, you'll notice that polyfills are included in the build output — even for features like `JSON.parse`, which are already [supported by the target browsers.](./.browserslistrc)

```diff
// vite.config.js

export default createViteConfig({
    ...
-   skipRequiredPolyfillCheck: ['esnext.json.parse'],
+   includeRequiredPolyfill: ['esnext.json.parse'],
})
```

[The build output includes an `import` statement for the polyfill.](./build-result/parseJson.mjs)

```js
// build-result/parseJson.mjs

import _JSON$parse from "core-js-pure/features/json/parse.js";

// ...
```

For more information on why polyfills may be unintentionally included, please refer to the [README](../../README.md#includerequiredpolyfill-vs-skiprequiredpolyfillcheck).
