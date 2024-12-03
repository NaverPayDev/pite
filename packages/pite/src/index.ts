import babel from '@rollup/plugin-babel'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import {BuildOptions, defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import {shouldInjectPolyfill} from './polyfill'

function getEntry(input: Record<string, string>) {
    const entries = Object.entries(input)
    return entries.reduce((acc, entry) => {
        const [name, path] = entry

        const splittedPath = typeof path === 'string' ? path.split('/src/') : []

        if (splittedPath.length < 2) {
            throw Error('input으로는 src 하위 파일 경로만 넣을 수 있습니다')
        }

        const [dir, filePath] = splittedPath

        if (!filePath.includes(name)) {
            throw Error('input의 key, src하위의 파일명을 일치시켜주세요')
        }

        return {
            ...acc,
            [name]: `${dir}/src/${filePath}`,
        }
    }, {})
}

interface ViteConfigProps {
    formats: ('es' | 'cjs')[]
    input: Record<string, string>
    options?: BuildOptions
}

export function createViteConfig({formats, input, options}: ViteConfigProps) {
    const build: BuildOptions = {
        target: browserslistToEsbuild(),
        lib: {
            formats,
            entry: getEntry(input),
            fileName: (format, entry) => {
                const directory = format === 'es' ? 'esm' : 'cjs'
                const extension = format === 'es' ? 'mjs' : 'js'

                const filePath = entry.includes('/') ? '' : input[entry]?.split('src/')[1]

                if (typeof filePath !== 'string') {
                    throw Error(`filePath undefined error. input 확인`)
                }

                return `${directory}/${filePath}.${extension}`
            },
        },
        rollupOptions: {
            external: (id) => /core-js-pure/.test(id),
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
