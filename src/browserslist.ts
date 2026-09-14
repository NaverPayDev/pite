import {cosmiconfigSync} from 'cosmiconfig'

import {Manifest} from './manifest'

export function getBrowserslistConfig(cwd: string, manifest: Manifest) {
    const reader = cosmiconfigSync('browserslist')
    const browserslist = reader.search(cwd)
    if (browserslist) {
        return browserslist.config
    }
    return manifest.browserslist
}
