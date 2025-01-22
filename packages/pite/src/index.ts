import defaultBrowserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {BuildOptions, defineConfig, Plugin} from 'vite'

import {getBrowserslistConfig} from './browserslist'
import {getExternalDependencies} from './dependencies'
import {getViteEntry} from './getViteEntry'
import {shouldInjectPolyfill} from './polyfill'
import {isValidBrowserslistConfig, replaceExtension} from './util'
import vitePluginTsup from './vite-tsup-plugin'

const ESM_REGEX = /\/(es|esm)/

export interface ViteConfigProps {
    cwd: string
    formats: ('es' | 'cjs')[]
    entry: string[]
    cssFileName?: string
    outDir?: string[]
    allowedPolyfills?: string[]
    ignoredPolyfills?: string[]
    options?: BuildOptions
}

export function createViteConfig({
    cwd,
    formats,
    entry,
    cssFileName = 'style.css',
    outDir = [],
    allowedPolyfills = [],
    ignoredPolyfills = [],
    options,
}: ViteConfigProps) {
    const browserslistConfig = getBrowserslistConfig(cwd)
    const externalDeps = getExternalDependencies(cwd)

    const {lib: inputLib, rollupOptions: inputRollupOptions, ...restOptions} = options || {lib: {}, rollupOptions: {}}

    const inputExternal = inputRollupOptions?.external || ([] as string[])
    const external =
        typeof inputExternal === 'function'
            ? inputExternal
            : Array.isArray(inputExternal)
              ? [/core-js-pure/, ...externalDeps, ...inputExternal]
              : [/core-js-pure/, ...externalDeps, inputExternal]

    delete inputRollupOptions?.external

    const inputRollupPlugin = (inputRollupOptions?.plugins || []) as Plugin[]
    inputRollupOptions?.plugins && delete inputRollupOptions?.plugins

    const esmDir = outDir?.find((outDirectory) => ESM_REGEX.test(outDirectory)) ?? 'dist'
    const cjsDir = outDir?.find((outDirectory) => !ESM_REGEX.test(outDirectory)) ?? 'dist'

    const browserslist = isValidBrowserslistConfig(browserslistConfig) ? browserslistConfig : defaultBrowserslist

    const build: BuildOptions = {
        target: browserslistToEsbuild(browserslist),
        lib: {
            cssFileName: cssFileName.replace('.css', ''),
            formats,
            entry: getViteEntry(entry),
            ...inputLib,
        },
        rollupOptions: {
            external,
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
                    assetFileNames: (assetInfo) => {
                        if (!assetInfo.names) {
                            return ''
                        }
                        if (assetInfo.names.length > 0 && assetInfo.names[0] === 'style.css') {
                            return cssFileName
                        }

                        return assetInfo.names[0]
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
                                shouldInjectPolyfill: shouldInjectPolyfill({
                                    allowed: new Set(allowedPolyfills),
                                    ignored: new Set(ignoredPolyfills),
                                }),
                                debug: true,
                                targets: browserslist,
                            },
                        ],
                    ],
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                    exclude: /node_modules/,
                }),
                ...inputRollupPlugin,
            ],
            ...inputRollupOptions,
        },
        ...restOptions,
    }

    const plugins = [
        vitePluginTsup({
            formats,
            entry,
            outDir: {
                esm: esmDir,
                cjs: cjsDir,
            },
        }),
    ]

    return defineConfig({
        build,
        plugins,
    })
}
