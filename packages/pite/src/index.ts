import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {BuildOptions, defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import {shouldInjectPolyfill} from './polyfill'

export interface ViteConfigProps {
    formats: ('es' | 'cjs')[]
    entry: string | string[] | Record<string, string>
    options?: BuildOptions
}

export function createViteConfig({formats, entry, options}: ViteConfigProps) {
    const build: BuildOptions = {
        target: browserslistToEsbuild(),
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
                    entryFileNames: '[name].mjs',
                    preserveModules: true,
                },
                {
                    dir: 'dist/cjs',
                    format: 'cjs',
                    entryFileNames: '[name].js',
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

    return defineConfig({
        build,
        plugins,
    })
}
