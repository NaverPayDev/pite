/* eslint-disable no-console */
import packageJsonContent from 'browserslist/package.json' with {type: 'json'}
import chalk from 'chalk'

export async function printCaniuseLiteVersion() {
    try {
        const caniuseVersion = packageJsonContent.dependencies['caniuse-lite'].replace('^', '')
        const caniuseUrl = `https://unpkg.com/browse/caniuse-lite@${caniuseVersion}/`

        console.log(chalk.magenta(`\ncurrent caniuse-lite version : ${caniuseVersion}\n${caniuseUrl}\n`))
    } catch (error) {
        console.error('cannot found browserslist version', error)
    }
}
