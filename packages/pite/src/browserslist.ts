import fs from 'node:fs'
import path from 'node:path'

import {cosmiconfigSync} from 'cosmiconfig'

export function getBrowserslistConfig(packageDir: string) {
    const reader = cosmiconfigSync('browserslist')
    const browserslist = reader.search(packageDir)
    if (browserslist) {
        return browserslist.config
    }
    const packageJSONPath = path.join(packageDir, 'package.json')
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
    if ('browserslist' in packageJSON) {
        return packageJSON.browserslist
    }
}
