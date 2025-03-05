import defaultBrowserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import preserveDirectives from 'rollup-plugin-preserve-directives'
import {PluginVisualizerOptions, visualizer} from 'rollup-plugin-visualizer'
import {BuildOptions, defineConfig, Plugin} from 'vite'

import {getBrowserslistConfig} from './browserslist'
import {getExternalDependencies} from './dependencies'
import {getViteEntry} from './get-vite-entry'
import publint from './plugins/rollup-plugin-publint'
import {shouldInjectPolyfill} from './polyfill'
import {isValidBrowserslistConfig, replaceExtension} from './util'
import vitePluginTsup from './vite-tsup-plugin'

export interface ViteConfigProps {
    cwd?: string
    entry: string | string[] | Record<string, string>
    outputs?: {format: 'es' | 'cjs'; dist: string}[]
    cssFileName?: string
    visualize?: boolean | PluginVisualizerOptions
    allowedPolyfills?: string[]
    ignoredPolyfills?: string[]
    options?: BuildOptions
    css?: false | {filename: string; extract?: boolean; minify?: boolean; modules?: boolean; scss?: boolean}
}

export function createViteConfig({
    cwd = '.',
    entry,
    outputs = [
        {format: 'es', dist: 'dist/esm'},
        {format: 'cjs', dist: 'dist/cjs'},
    ],
    visualize = false,
    allowedPolyfills = [],
    ignoredPolyfills = [],
    options,
    css: cssOptions = false,
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
            formats,
            entry: getViteEntry(entry),
            ...(cssOptions ? {cssFileName: cssOptions.filename.replace('.css', '')} : {}),
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
                ...(visualize ? [visualizer(typeof visualize === 'object' ? visualize : {})] : []),
                preserveDirectives(),
                publint({cwd}),
            ],
            ...inputRollupOptions,
        },
        ...(cssOptions
            ? {
                  cssCodeSplit: cssOptions.extract || false,
                  cssMinify: cssOptions.minify || false,
              }
            : {}),
        ...restOptions,
    }

    const plugins = [vitePluginTsup({formats, entry, outDir: {esm: esmDir, cjs: cjsDir}})]

    return defineConfig({
        build,
        plugins,
        ...(cssOptions
            ? {
                  css: {
                      modules: cssOptions.modules
                          ? {localsConvention: 'camelCase', generateScopedName: '[name]__[local]___[hash:base64:5]'}
                          : false,
                      preprocessorOptions: cssOptions.scss
                          ? {scss: {additionalData: `@use "sass:math"; @use "sass:color";`}}
                          : undefined,
                  },
              }
            : {}),
    })
}
