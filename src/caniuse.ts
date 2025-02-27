/* eslint-disable no-console */
import {readFile} from 'fs/promises'

import chalk from 'chalk'

export async function printCaniuseLiteVersion() {
    try {
        const packageJsonUrl = import.meta.resolve('browserslist/package.json')
        const packageJsonPath = new URL(packageJsonUrl).pathname
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
        const browserslistInfo = JSON.parse(packageJsonContent)
        const caniuseVersion = browserslistInfo.dependencies['caniuse-lite'].replace('^', '')
        const caniuseUrl = `https://unpkg.com/browse/caniuse-lite@${caniuseVersion}/`

        console.log(chalk.magenta(`\ncurrent caniuse-lite version : ${caniuseVersion}\n${caniuseUrl}\n`))
    } catch (error) {
        console.error('cannot found browserslist version', error)
    }
}
