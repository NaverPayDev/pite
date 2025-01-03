import fs from 'fs'

import browserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {BuildOptions, defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import {getBrowserslistConfig} from './browserslist'
import {getExternalDependencies} from './dependencies'
import {shouldInjectPolyfill} from './polyfill'

const ESM_REGEX = /\/(es|esm)/

export interface ViteConfigProps {
    cwd: string
    formats: ('es' | 'cjs')[]
    entry: string | string[] | Record<string, string>
    outDir?: string[]
    allowedPolyfills?: string[]
    options?: BuildOptions
}

const replaceExtension = (target: string, replacement: '.mjs' | '.js') => {
    // .ts .jsx .tsx
    const regex = /\.([tj]s[x]?)/
    return target.replace(regex, replacement)
}

const getTypeExtension = (filePath: string, isEsm: boolean) =>
    isEsm ? filePath.replace('.d.ts', '.d.mts') : filePath.replace('.d.mts', '.d.ts')

export function createViteConfig({cwd, formats, entry, outDir = [], allowedPolyfills = [], options}: ViteConfigProps) {
    const browserslistConfig = getBrowserslistConfig(cwd)
    const externalDeps = getExternalDependencies(cwd)

    const esmDir = outDir?.find((outDirectory) => ESM_REGEX.test(outDirectory)) ?? 'dist'
    const cjsDir = outDir?.find((outDirectory) => !ESM_REGEX.test(outDirectory)) ?? 'dist'

    const build: BuildOptions = {
        target: browserslistToEsbuild(browserslistConfig || browserslist),
        lib: {
            formats,
            entry,
        },
        rollupOptions: {
            external: [/core-js-pure/, ...externalDeps],
            output: formats.map((format) => {
                const isEsm = format === 'es'
                const extension = isEsm ? '.mjs' : '.js'

                return {
                    dir: isEsm ? esmDir : cjsDir,
                    format,
                    preserveModules: true,
                    entryFileNames: (chunkInfo) => {
                        const subPath = chunkInfo.facadeModuleId?.split('src')[1]

                        if (subPath) {
                            const relativePath = subPath.startsWith('/') ? subPath.slice(1) : subPath
                            return replaceExtension(relativePath, extension)
                        }

                        return `${chunkInfo.name}${extension}`
                    },
                }
            }),
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
                                shouldInjectPolyfill: shouldInjectPolyfill(new Set(allowedPolyfills)),
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

    const hasEsm = !!formats?.find((format) => format === 'es')
    const plugins = [
        dts({
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['**/*.bench.ts', '**/*.test.ts', 'src/**/__tests__/**'],
            outDir: formats.map((format) => {
                return format === 'es' ? esmDir : cjsDir
            }),
            beforeWriteFile: (filePath, content) => {
                if (outDir.length === 0) {
                    // .d.ts 파일이 동일 경로에 존재하는데 es format이 있는 경우
                    const isExistDTS = fs.existsSync(filePath)
                    const isEsm = hasEsm && isExistDTS

                    // format이 하나고 es인 경우
                    const isEsmOnly = formats.length === 1 && formats[0] === 'es'

                    return {filePath: getTypeExtension(filePath, isEsm || isEsmOnly), content}
                }

                const isEsm = filePath.includes(esmDir) && hasEsm
                return {filePath: getTypeExtension(filePath, isEsm), content}
            },
        }),
    ]

    return defineConfig({build, plugins})
}
