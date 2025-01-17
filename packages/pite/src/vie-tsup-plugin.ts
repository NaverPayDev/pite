/* eslint-disable no-console */

import {build, Format} from 'tsup'
import {Plugin} from 'vite'

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
export default function vitePluginTsup({formats, entry, outDir}: VitePluginProps): Plugin {
    const hasEsm = formats.some((format) => format === 'es')
    const hasCjs = formats.some((format) => format === 'cjs')

    return {
        name: 'vite-plugin-tsup',
        async closeBundle() {
            try {
                console.log('Starting tsup to generate .d.ts files...')

                if (hasEsm) {
                    await build(createConfig({entry, format: 'esm', outDir: outDir.esm}))
                }

                if (hasCjs) {
                    await build(createConfig({entry, format: 'cjs', outDir: outDir.cjs}))
                }

                console.log('tsup finished successfully.')
            } catch (error) {
                console.error('Error running tsup plugin:', error)
            }
        },
    }
}
