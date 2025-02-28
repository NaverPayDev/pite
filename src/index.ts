import defaultBrowserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import preserveDirectives from 'rollup-plugin-preserve-directives'
import {BuildOptions, defineConfig, Plugin} from 'vite'

import {getBrowserslistConfig} from './browserslist'
import {getExternalDependencies} from './dependencies'
import {getViteEntry} from './getViteEntry'
import publint from './plugins/rollup-plugin-publint'
import {shouldInjectPolyfill} from './polyfill'
import {isValidBrowserslistConfig, replaceExtension} from './util'
import vitePluginTsup from './vite-tsup-plugin'

export interface ViteConfigProps {
    entry: string | string[] | Record<string, string>
    cwd?: string
    cssFileName?: string
    outputs?: {format: 'es' | 'cjs'; dist: string}[]
    allowedPolyfills?: string[]
    ignoredPolyfills?: string[]
    options?: BuildOptions
}

export function createViteConfig({
    cwd = '.',
    entry,
    outputs = [
        {format: 'es', dist: 'dist/esm'},
        {format: 'cjs', dist: 'dist/cjs'},
    ],
    cssFileName = 'style.css',
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

    const formats = outputs.map(({format}) => format)

    const esmDir = outputs?.find(({format}) => format === 'es')?.dist ?? 'dist'
    const cjsDir = outputs?.find(({format}) => format === 'cjs')?.dist ?? 'dist'

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
                preserveDirectives(),
                ...inputRollupPlugin,
                publint({cwd}),
            ],
            ...inputRollupOptions,
        },
        ...restOptions,
    }

    const plugins = [vitePluginTsup({formats, entry, outDir: {esm: esmDir, cjs: cjsDir}})]

    return defineConfig({build, plugins})
}
