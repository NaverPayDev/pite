/* eslint-disable no-console */

import path from 'path'

import chalk from 'chalk'
import {Plugin} from 'vite'

import {checkPhantomDeps, PhantomCheckResult} from '../phantom-deps'

interface PhantomDepsOption {
    cwd: string
    severity: 'error' | 'warn'
}

const usedIn = (count: number) => `(used in ${count} file${count > 1 ? 's' : ''})`

const sampleFiles = (files: Set<string>): string[] => {
    const lines = [...files].slice(0, 3).map((file) => chalk.dim(`     ${file}`))
    if (files.size > 3) {
        lines.push(chalk.dim(`     ... and ${files.size - 3} more`))
    }
    return lines
}

const fixDependencies = (entries: [string, {required: string; misplacedIn?: string}][]): string[] => {
    const allMisplaced = entries.every(([, p]) => p.misplacedIn)
    const verb = allMisplaced ? 'move to' : 'add to'
    return [
        chalk.yellow(`Fix: ${verb} "dependencies" in package.json:`),
        ...entries.map(([name, {required}]) => `  "${name}": ">=${required}"`),
    ]
}

const formatPhantoms = (phantoms: PhantomCheckResult['phantoms'], mark: string): string => {
    const lines = ['Injected into the build output but not declared in package.json:', '']
    for (const [name, {files, misplacedIn}] of phantoms) {
        lines.push(`  ${mark} ${chalk.bold(name)} ${usedIn(files.size)}`, ...sampleFiles(files))
        if (misplacedIn) {
            lines.push(chalk.yellow(`     declared in "${misplacedIn}". move it to "dependencies"`))
        }
    }
    lines.push(
        '',
        chalk.yellow('Why:'),
        '  pite injects these as unconditional runtime imports, so the consumer must be able',
        '  to resolve them. "peerDependencies"/"optionalDependencies" can be absent at install',
        '  and crash at runtime; only "dependencies"/"bundledDependencies" guarantee resolution.',
        '',
        ...fixDependencies([...phantoms]),
    )
    return lines.join('\n')
}

const formatOutdated = (outdated: PhantomCheckResult['outdated'], mark: string): string => {
    const lines = ['Declared below the version pite injects:', '']
    for (const [name, {declared, floor, required}] of outdated) {
        lines.push(`  ${mark} ${chalk.bold(name)}: declared "${declared}" (floor ${floor}), pite injects >=${required}`)
    }
    lines.push(
        '',
        chalk.yellow('Fix: raise the range in package.json:'),
        ...[...outdated].map(([name, {required}]) => `  "${name}": ">=${required}"`),
    )
    return lines.join('\n')
}

const formatUnverifiable = (unverifiable: PhantomCheckResult['unverifiable']): string => {
    const lines = [chalk.yellow('Declared with a range whose floor pite cannot verify at build time:'), '']
    for (const [name, {declared, required}] of unverifiable) {
        lines.push(`  ${chalk.yellow('?')} ${chalk.bold(name)}: "${declared}" (pite injects >=${required})`)
    }
    lines.push(
        '',
        chalk.dim('  workspace:/catalog:/git/tarball/tag ranges resolve at install time.'),
        chalk.dim('  Make sure the resolved version is >= the version above.'),
    )
    return lines.join('\n')
}

const phantomDeps = ({cwd, severity}: PhantomDepsOption): Plugin => {
    const outputImports = new Map<string, Set<string>>()

    const addImport = (specifier: string, file: string) => {
        if (!outputImports.has(specifier)) {
            outputImports.set(specifier, new Set())
        }
        outputImports.get(specifier)!.add(file)
    }

    return {
        name: 'rollup-plugin-phantom-deps',
        buildStart() {
            outputImports.clear()
        },
        generateBundle(options, bundle) {
            for (const [fileName, chunk] of Object.entries(bundle)) {
                if (chunk.type !== 'chunk') {
                    continue
                }
                const displayPath = options.dir ? path.relative(cwd, path.join(options.dir, fileName)) : fileName
                for (const specifier of [...chunk.imports, ...chunk.dynamicImports]) {
                    addImport(specifier, displayPath)
                }
            }
        },
        closeBundle() {
            console.log(chalk.blue('\n[🔨 phantom-deps]'))
            const {phantoms, outdated, unverifiable, skipReason} = checkPhantomDeps(cwd, outputImports)

            if (skipReason) {
                console.log(chalk.yellow(`Skipped: ${skipReason}\n`))
                return
            }
            if (phantoms.size === 0 && outdated.size === 0 && unverifiable.size === 0) {
                console.log(chalk.green('All good!\n'))
                return
            }

            const mark = severity === 'error' ? chalk.red('✗') : chalk.yellow('!')
            const blocks: string[] = []
            if (phantoms.size > 0) {
                blocks.push(formatPhantoms(phantoms, mark))
            }
            if (outdated.size > 0) {
                blocks.push(formatOutdated(outdated, mark))
            }
            if (unverifiable.size > 0) {
                blocks.push(formatUnverifiable(unverifiable))
            }
            console.log(blocks.join('\n\n') + '\n')

            if (severity === 'error' && (phantoms.size > 0 || outdated.size > 0)) {
                this.error('phantom-deps check failed')
            }
        },
    }
}

export default phantomDeps
