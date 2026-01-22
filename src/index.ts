import defaultBrowserslist from '@naverpay/browserslist-config'
import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {PluginVisualizerOptions, visualizer} from 'rollup-plugin-visualizer'
import preserveDirectives from 'rollup-preserve-directives'
import {BuildOptions, defineConfig, Plugin, UserConfig} from 'vite'

import {getBrowserslistConfig} from './browserslist'
import {getExternalDependencies} from './dependencies'
import {getViteEntry} from './get-vite-entry'
import publintPlugin from './plugins/rollup-plugin-publint'
import {shouldInjectPolyfill} from './polyfill'
import {isValidBrowserslistConfig, replaceExtension} from './util'
import vitePluginTsup from './vite-tsup-plugin'

export interface ViteConfigProps {
    /**
     * Current working directory
     *
     * @default - '.'
     */
    cwd?: string
    /**
     * Entry file path (supports glob patterns)
     */
    entry: string | string[] | Record<string, string>
    /**
     * Specifies module format and output directory
     *
     * @default - [{format: 'es', dist: 'dist/esm'}, {format: 'cjs', dist: 'dist/cjs'}]
     */
    outputs?: {format: 'es' | 'cjs'; dist: string}[]
    /**
     * Output CSS file name
     *
     * @default - 'style.css'
     */
    cssFileName?: string
    /**
     * Enables `rollup-plugin-visualizer`
     * @description configure options for `rollup-plugin-visualizer`
     *
     * @default - false
     * @see https://github.com/btd/rollup-plugin-visualizer?tab=readme-ov-file#options
     */
    visualize?: boolean | PluginVisualizerOptions
    /**
     * Publint severity setting
     *
     * - `'error'`: Exit code is 1 when the Publint check fails
     * - `'warn'`: Prints a warning if the Publint check fails (doesn’t affect exit code)
     * - `'off'`: Disables the Publint check
     *
     * @default - {severity: 'error'}
     */
    publint?: {severity?: 'error' | 'warn' | 'off'}
    /**
     * List of polyfills that need to be injected
     */
    includeRequiredPolyfill?: string[]
    /**
     * Skip verification for required polyfill injection
     * (use with caution - omitting truly required polyfills may cause issues in unsupported environments)
     */
    skipRequiredPolyfillCheck?: string[]
    /**
     * Additional Vite build options
     *
     * @see https://vite.dev/config/build-options
     * @see https://ko.vite.dev/config/build-options
     * @deprecated Use `config.build` instead
     */
    options?: BuildOptions

    /**
     * Vite plugins
     * @see https://vite.dev/guide/using-plugins
     * @deprecated Use `config.plugins` instead
     */
    vitePlugins?: UserConfig['plugins']

    /**
     * Additional Vite config options
     * (e.g., build, plugins, assetsInclude, define, resolve, etc.)
     *
     * @see https://vite.dev/config/
     */
    config?: UserConfig
}

export function createViteConfig({
    cwd = '.',
    entry,
    outputs = [
        {format: 'es', dist: 'dist/esm'},
        {format: 'cjs', dist: 'dist/cjs'},
    ],
    cssFileName = 'style.css',
    visualize = false,
    publint: {severity = 'error'} = {},
    includeRequiredPolyfill = [],
    skipRequiredPolyfillCheck = [],
    vitePlugins = [],
    options,
    config,
}: ViteConfigProps) {
    const browserslistConfig = getBrowserslistConfig(cwd)
    const externalDeps = getExternalDependencies(cwd)

    // Merge deprecated options with config.build
    const mergedBuildOptions = {...options, ...config?.build}
    const {
        lib: inputLib,
        rollupOptions: inputRollupOptions,
        ...restOptions
    } = mergedBuildOptions || {lib: {}, rollupOptions: {}}

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
                                    include: new Set(includeRequiredPolyfill),
                                    skip: new Set(skipRequiredPolyfillCheck),
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
                ...(severity !== 'off' ? [publintPlugin({cwd, severity})] : []),
            ],
            ...inputRollupOptions,
        },
        ...restOptions,
    }

    const plugins: UserConfig['plugins'] = [
        vitePluginTsup({formats, entry, outDir: {esm: esmDir, cjs: cjsDir}}),
        ...(vitePlugins || []),
        ...(config?.plugins || []),
    ]

    return defineConfig({...config, build, plugins})
}
