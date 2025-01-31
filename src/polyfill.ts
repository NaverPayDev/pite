/** @see https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.mjs */
/**
 *
 * @param allowed
 * @example ['es.array.find-last']
 */

export const shouldInjectPolyfill =
    ({allowed, ignored}: {allowed: Set<string>; ignored: Set<string>}) =>
    (polyfill: string, shouldInject: boolean) => {
        if (ignored.has(polyfill)) {
            return false
        }

        if (shouldInject && !allowed.has(polyfill)) {
            throw new Error(`Your project contains code that requires polyfills [${polyfill}]`)
        }

        return shouldInject
    }
