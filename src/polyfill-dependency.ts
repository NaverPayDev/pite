/* eslint-disable no-console */

import chalk from 'chalk'
import semver from 'semver'

import {Manifest} from './manifest'

/** The core-js version pite generates polyfill paths for, and the floor consumers must declare. */
export const CORE_JS_VERSION = '3.39.0'

const PACKAGE = 'core-js-pure'

/**
 * Thrown while the config is being created, so Vite aborts the build before any transform.
 * Vite prints `error.stack` for config errors; the details are already printed above, so keep it to one line.
 */
export class PolyfillDependencyError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'PolyfillDependencyError'
        this.stack = message
    }
}

export function assertPolyfillDependency(manifest: Manifest): void {
    console.log(chalk.blue('\n[🔨 polyfill-dependency]'))

    const range = manifest.dependencies?.[PACKAGE]
    if (range === undefined) {
        const misplaced = findMisplaced(manifest)
        report(
            misplaced
                ? `${chalk.bold(PACKAGE)} is declared in "${misplaced}", not in "dependencies"`
                : `${chalk.bold(PACKAGE)} is not declared in "dependencies"`,
            [
                `includeRequiredPolyfill injects ${PACKAGE} imports into the build output,`,
                `and consumers resolve them from their own node_modules.`,
            ],
            misplaced ? 'move it to "dependencies" in package.json:' : 'add it to "dependencies" in package.json:',
        )
        throw new PolyfillDependencyError('polyfill-dependency check failed')
    }

    const valid = semver.validRange(range)
    if (valid === null || valid === '*') {
        // catalog:, workspace:, dist-tags and git refs have no computable floor
        console.log(
            `  ${chalk.yellow('?')} ${chalk.bold(PACKAGE)}: "${range}" ${chalk.dim(`(pite injects >=${CORE_JS_VERSION})`)}`,
        )
        console.log(
            chalk.dim(`    resolves at install time. Make sure the resolved version is >=${CORE_JS_VERSION}.\n`),
        )
        return
    }

    const floor = semver.minVersion(valid)!.version
    if (semver.lt(floor, CORE_JS_VERSION)) {
        report(
            `${chalk.bold(PACKAGE)}: declared "${range}" (floor ${floor}), pite injects >=${CORE_JS_VERSION}`,
            [`Files referenced by the build output may not exist below ${CORE_JS_VERSION}.`],
            'raise the range in package.json:',
        )
        throw new PolyfillDependencyError('polyfill-dependency check failed')
    }

    console.log(chalk.green('All good!\n'))
}

function findMisplaced(manifest: Manifest) {
    return (['peerDependencies', 'optionalDependencies', 'devDependencies'] as const).find(
        (field) => manifest[field]?.[PACKAGE],
    )
}

function report(problem: string, why: string[], fix: string) {
    console.log(`  ${chalk.red('✗')} ${problem}`)
    for (const line of why) {
        console.log(chalk.dim(`    ${line}`))
    }
    console.log('')
    console.log(chalk.yellow(`Fix: ${fix}`))
    console.log(`  "${PACKAGE}": "^${CORE_JS_VERSION}"`)
    console.log('')
    console.log(chalk.dim('If these polyfills are not needed, use skipRequiredPolyfillCheck instead.\n'))
}
