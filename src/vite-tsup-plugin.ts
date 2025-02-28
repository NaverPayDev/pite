/* eslint-disable no-console */

import chalk from 'chalk'
import {build, Format} from 'tsup'
import {Plugin} from 'vite'

// css, .js, .jsx를 필터링합니다
const filterEntry = (entry: string[]) => {
    const excludeExts = ['.css', '.js', '.jsx']
    return entry.filter((pattern) => !excludeExts.some((exts) => pattern.includes(exts)))
}

interface TsupConfigProps {
    entry: string[]
    format: Exclude<Format, 'iife'>
    outDir: string
}
const createConfig = ({format, entry, outDir}: TsupConfigProps) => {
    return {
        entry,
        outDir,
        dts: {only: true},
        format: [format],
    }
}

interface VitePluginProps {
    entry: string[]
    formats: ('cjs' | 'es')[]
    outDir: {
        esm: string
        cjs: string
    }
}
export default function vitePluginTsup({formats, entry: rawEntry, outDir}: VitePluginProps): Plugin {
    const entry = filterEntry(rawEntry)

    const hasEsm = formats.some((format) => format === 'es')
    const hasCjs = formats.some((format) => format === 'cjs')

    if (entry.length === 0) {
        return {name: 'vite-plugin-tsup'}
    }

    return {
        name: 'vite-plugin-tsup',
        async closeBundle() {
            try {
                console.log(chalk.blue('\nStarting tsup to generate .d.ts files...\n'))

                if (hasEsm) {
                    await build(createConfig({entry, format: 'esm', outDir: outDir.esm}))
                }

                if (hasCjs) {
                    await build(createConfig({entry, format: 'cjs', outDir: outDir.cjs}))
                }

                console.log(chalk.green('\ntsup finished successfully.'))
            } catch (error) {
                console.error(chalk.red('Error running tsup plugin:'), error)
            }
        },
    }
}
