/* eslint-disable no-console */
/** @see https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.mjs */

import chalk from 'chalk'

export const shouldInjectPolyfill =
    ({include, skip}: {include: Set<string>; skip: Set<string>}) =>
    (polyfill: string, shouldInject: boolean) => {
        if (skip.has(polyfill)) {
            return false
        }

        if (shouldInject && !include.has(polyfill)) {
            console.log(chalk.red(`[Polyfill Injection Required] ${polyfill}\n`))
            console.log(
                chalk.redBright(
                    `To use this polyfill, please do one of the following:\n` +
                        `1. Add it to 'includeRequiredPolyfill' to allow injection.\n` +
                        `2. Add it to 'skipRequiredPolyfillCheck' to skip the verification.\n\n` +
                        `After making the necessary changes, try building again.\n\n` +
                        `⚠️ Note: Polyfills will not be added automatically. Any errors due to unsupported methods in certain browsers or environments will be the responsibility of the package user.\n` +
                        `(core-js adds polyfills even for specific browser bugs, so carefully consider whether a polyfill is truly necessary.)`,
                ),
            )
            process.exit(1)
        }

        return shouldInject
    }
