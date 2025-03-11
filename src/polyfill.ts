/** @see https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.mjs */

export const shouldInjectPolyfill =
    ({include, skip}: {include: Set<string>; skip: Set<string>}) =>
    (polyfill: string, shouldInject: boolean) => {
        if (skip.has(polyfill)) {
            return false
        }

        if (shouldInject && !include.has(polyfill)) {
            throw new Error(
                `[Polyfill Injection Required] ${polyfill}\n\n` +
                    `To use this polyfill, please do one of the following:\n` +
                    `1. Add it to 'includeRequiredPolyfill' to allow injection.\n` +
                    `2. Add it to 'skipRequiredPolyfillCheck' to skip the verification.\n\n` +
                    `After making the necessary changes, try building again.`,
            )
        }

        return shouldInject
    }
