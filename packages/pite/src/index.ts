import browserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import {getBrowserslistConfig} from 'browserslist'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {BuildOptions, defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import {shouldInjectPolyfill} from './polyfill'

export interface ViteConfigProps {
    packageDir: string
    formats: ('es' | 'cjs')[]
    entry: string | string[] | Record<string, string>
    options?: BuildOptions
}

const replaceExtension = (target: string, replacement: '.mjs' | '.js') => {
    // .ts .jsx .tsx
    const regex = /\.([tj]s[x]?)/
    return target.replace(regex, replacement)
}

export function createViteConfig({packageDir, formats, entry, options}: ViteConfigProps) {
    const browserslistConfig = getBrowserslistConfig(packageDir)

    const build: BuildOptions = {
        target: browserslistToEsbuild(browserslistConfig || browserslist),
        lib: {
            formats,
            entry,
        },
        rollupOptions: {
            external: (id) => /core-js-pure/.test(id),
            output: [
                {
                    dir: 'dist/esm',
                    format: 'es',
                    entryFileNames: (chunkInfo) => {
                        const subPath = chunkInfo.facadeModuleId?.split('src')[1]

                        if (subPath) {
                            const relativePath = subPath.startsWith('/') ? subPath.slice(1) : subPath
                            return replaceExtension(relativePath, '.mjs')
                        }

                        return `${chunkInfo.name}.mjs`
                    },
                    preserveModules: true,
                },
                {
                    dir: 'dist/cjs',
                    format: 'cjs',
                    entryFileNames: (chunkInfo) => {
                        const subPath = chunkInfo.facadeModuleId?.split('src')[1]

                        if (subPath) {
                            const relativePath = subPath.startsWith('/') ? subPath.slice(1) : subPath
                            return replaceExtension(relativePath, '.js')
                        }

                        return `${chunkInfo.name}.js`
                    },
                    preserveModules: true,
                },
            ],
            plugins: [
                babel({
                    babelHelpers: 'runtime',
                    plugins: [
                        ['@babel/plugin-transform-runtime'],
                        [
                            'babel-plugin-polyfill-corejs3',
                            {
                                method: 'usage-pure',
                                version: '3.39.0',
                                proposals: true,
                                shouldInjectPolyfill,
                                debug: true,
                            },
                        ],
                    ],
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    exclude: /node_modules/,
                }),
            ],
        },
        ...(options || {}),
    }

    const plugins = [
        dts({
            outDir: ['dist/cjs', 'dist/esm'],
            beforeWriteFile: (filePath, content) => {
                const isEsm = filePath.includes('esm')
                const replacedFilePath = isEsm ? filePath.replace('.d.ts', '.d.mts') : filePath

                return {filePath: replacedFilePath, content}
            },
        }),
    ]

    return defineConfig({build, plugins})
}
