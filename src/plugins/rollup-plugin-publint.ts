/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'

import {verifyPackageJSON as publintBeforeBuild} from '@naverpay/publint'
import chalk from 'chalk'
import {publint as publintAfterBuild} from 'publint'
import {formatMessage} from 'publint/utils'
import {Plugin} from 'vite'

interface PublintOption {
    cwd: string
    severity: 'error' | 'warn'
}

const publint = ({cwd, severity}: PublintOption): Plugin => {
    let hasBuildStartError = false

    return {
        name: 'rollup-plugin-publint',
        buildStart() {
            console.log(chalk.blue('\n[🔨 publint-before-build]'))
            try {
                publintBeforeBuild(cwd)
                console.log(chalk.green('All good!\n'))
            } catch (error) {
                if (error instanceof Error) {
                    console.log(
                        `- [${severity === 'error' ? chalk.red('error') : chalk.yellow('warning')}] ${error.message}`,
                    )
                }
                hasBuildStartError = true
                console.log('\n')
                if (severity === 'error') {
                    this.error(error instanceof Error ? error.message : 'publint check failed before build')
                }
            }
        },
        closeBundle: {
            handler: async () => {
                if (hasBuildStartError) {
                    return
                }

                let hasBuildEndError = false
                const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'))
                const {messages} = await publintAfterBuild({pkgDir: cwd})

                if (messages.length === 0) {
                    console.log(chalk.blue('\n[🔨 publint-after-build]'))
                    console.log(chalk.green('All good!\n'))
                    return
                }

                console.log(chalk.blue('\n[🔨 publint-after-build]'))
                for (const message of messages) {
                    const hasError = message.type === 'error'

                    if (hasError) {
                        hasBuildEndError = true
                    }

                    console.log(
                        `- [${hasError && severity === 'error' ? chalk.red(message.type) : chalk.yellow(message.type)}] ${formatMessage(message, pkg)}`,
                    )
                }
                if (hasBuildEndError) {
                    console.log('\n')
                    if (severity === 'error') {
                        throw new Error('publint check failed after build')
                    }
                }
            },
            sequential: true,
        },
    }
}

export default publint
