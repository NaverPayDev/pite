import fs from 'fs'
import path from 'path'

import semver from 'semver'

export const PITE_INJECTED = {
    'core-js-pure': '3.39.0',
} as const

interface Manifest {
    name?: unknown
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    bundledDependencies?: string[]
}

export interface PhantomCheckResult {
    phantoms: Map<string, {files: Set<string>; required: string; misplacedIn?: string}>
    outdated: Map<string, {declared: string; floor: string; required: string}>
    unverifiable: Map<string, {declared: string; required: string}>
    skipReason?: string
}

const matchesPackage = (specifier: string, name: string) => specifier === name || specifier.startsWith(`${name}/`)

const collectImporters = (outputImports: Map<string, Set<string>>, name: string): Set<string> => {
    const files = new Set<string>()
    for (const [specifier, importers] of outputImports) {
        if (matchesPackage(specifier, name)) {
            for (const file of importers) {
                files.add(file)
            }
        }
    }
    return files
}

const toSemverRange = (raw: string): string | null => {
    let range = raw.trim()

    const alias = /^npm:.+@([^@]+)$/.exec(range)
    if (alias) {
        range = alias[1]
    }

    const gitSemver = /#semver:(.+)$/.exec(range)
    if (gitSemver) {
        range = gitSemver[1]
    }

    if (range.startsWith('workspace:')) {
        const rest = range.slice('workspace:'.length)
        if (rest === '' || rest === '*' || rest === '^' || rest === '~') {
            return null
        }
        range = rest
    }

    const valid = semver.validRange(range)
    return valid === null || valid === '*' ? null : range
}

const findMisplaced = (pkg: Manifest, name: string): string | undefined => {
    for (const field of ['peerDependencies', 'optionalDependencies', 'devDependencies'] as const) {
        const deps = pkg[field]
        if (deps && typeof deps === 'object' && name in deps) {
            return field
        }
    }
    return undefined
}

export const checkPhantomDeps = (cwd: string, outputImports: Map<string, Set<string>>): PhantomCheckResult => {
    const phantoms: PhantomCheckResult['phantoms'] = new Map()
    const outdated: PhantomCheckResult['outdated'] = new Map()
    const unverifiable: PhantomCheckResult['unverifiable'] = new Map()
    const empty = {phantoms, outdated, unverifiable}

    const pkgPath = path.join(cwd, 'package.json')
    if (!fs.existsSync(pkgPath)) {
        return {...empty, skipReason: `no package.json at ${cwd}`}
    }

    let pkg: Manifest
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    } catch (error) {
        return {
            ...empty,
            skipReason: `could not parse ${pkgPath}: ${error instanceof Error ? error.message : String(error)}`,
        }
    }
    if (typeof pkg.name !== 'string') {
        return {...empty, skipReason: `package.json has no "name" field (cwd: ${cwd})`}
    }

    for (const [name, required] of Object.entries(PITE_INJECTED)) {
        const files = collectImporters(outputImports, name)
        if (files.size === 0 || pkg.bundledDependencies?.includes(name)) {
            continue
        }

        const declared = pkg.dependencies?.[name]
        if (declared === undefined) {
            phantoms.set(name, {files, required, misplacedIn: findMisplaced(pkg, name)})
            continue
        }

        const range = toSemverRange(declared)
        if (range === null) {
            unverifiable.set(name, {declared, required})
            continue
        }

        const floor = semver.minVersion(range)?.version
        if (floor && semver.lt(floor, required)) {
            outdated.set(name, {declared, floor, required})
        }
    }

    return {phantoms, outdated, unverifiable}
}
