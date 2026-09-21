import builtins from 'builtin-modules'

import {Manifest} from './manifest'

const keysOf = (record: unknown) => (record && typeof record === 'object' ? Object.keys(record) : [])

export function getExternalDependencies(manifest: Manifest) {
    const deps = [...builtins, ...keysOf(manifest.dependencies), ...keysOf(manifest.peerDependencies)]

    return deps.flatMap((dep) => [dep, new RegExp(`^${dep}/.*`)])
}
