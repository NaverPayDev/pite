/** @see https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.mjs */
const Allowed = new Set<string>([
    // 'es.array.find-last'
])

export const shouldInjectPolyfill = (polyfill: string, shouldInject: boolean) => {
    if (shouldInject && !Allowed.has(polyfill)) {
        throw new Error(`Your project contains code that requires polyfills [${polyfill}]`)
    }

    return shouldInject
}
