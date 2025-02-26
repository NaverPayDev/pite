/* eslint-disable no-console */
import {readFile} from 'fs/promises'

export async function getCaniuseLiteVersion() {
    try {
        const packageJsonUrl = import.meta.resolve('browserslist/package.json')
        const packageJsonPath = new URL(packageJsonUrl).pathname
        const packageJsonContent = await readFile(packageJsonPath, 'utf-8')
        const browserslistInfo = JSON.parse(packageJsonContent)
        const caniuseVersion = browserslistInfo.dependencies['caniuse-lite'].replace('^', '')
        const caniuseUrl = `https://unpkg.com/browse/caniuse-lite@${caniuseVersion}/`

        console.log('\n\x1b[35mpite에서 사용중인 caniuse-lite 버전 : ', caniuseVersion)
        console.log(`\n\x1b[35m${caniuseUrl}`, '\n')
    } catch {
        console.error('browserslist 패키지를 찾을 수 없습니다.')
    }
}
