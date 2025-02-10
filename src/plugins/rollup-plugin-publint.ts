/* eslint-disable no-console */
import {spawnSync} from 'child_process'

import {verifyPackageJSON} from '@naverpay/publint'
import chalk from 'chalk'

interface PublintOption {
    cwd: string
}

const publint = ({cwd}: PublintOption) => {
    return {
        name: 'rollup-plugin-publint',
        buildStart() {
            console.log(chalk.blue('\n[publint-before-build]'))
            try {
                verifyPackageJSON(cwd)
                console.log(chalk.green('Publint passed with no issues before build.'))
            } catch {}
        },
        closeBundle() {
            console.log(chalk.blue('\n[publint-after-build]'))
            spawnSync('npx', ['publint', cwd], {stdio: 'inherit'})
        },
    }
}

export default publint
