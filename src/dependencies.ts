import fs from 'fs'
import path from 'path'

import builtins from 'builtin-modules'

export function getExternalDependencies(cwd: string) {
    const packageJSONPath = path.join(cwd, 'package.json')
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))

    let deps: string[] = [...builtins]

    if ('dependencies' in packageJSON && typeof packageJSON.dependencies === 'object') {
        deps = [...deps, ...Object.keys(packageJSON.dependencies)]
    }

    if ('peerDependencies' in packageJSON && typeof packageJSON.peerDependencies === 'object') {
        deps = [...deps, ...Object.keys(packageJSON.peerDependencies)]
    }

    return deps.flatMap((dep) => [dep, new RegExp(`^${dep}/.*`)])
}
