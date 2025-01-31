import fs from 'fs'
import path from 'path'

import {cosmiconfigSync} from 'cosmiconfig'

export function getBrowserslistConfig(cwd: string) {
    const reader = cosmiconfigSync('browserslist')
    const browserslist = reader.search(cwd)
    if (browserslist) {
        return browserslist.config
    }
    const packageJSONPath = path.join(cwd, 'package.json')
    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'))
    if ('browserslist' in packageJSON) {
        return packageJSON.browserslist
    }
}
