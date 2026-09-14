import fs from 'fs'
import path from 'path'

export interface Manifest {
    name?: string
    browserslist?: unknown
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
    optionalDependencies?: Record<string, string>
    devDependencies?: Record<string, string>
}

export function readManifest(cwd: string): Manifest {
    return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'))
}
