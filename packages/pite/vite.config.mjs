import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

export default defineConfig({
    build: {
        lib: {
            formats: ['cjs', 'es'],
            entry: 'src/index',
        },
        rollupOptions: {
            external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)].flatMap((dep) => [
                dep,
                new RegExp(`^${dep}/.*`),
            ]),
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
        },
        minify: false,
    },
    plugins: [
        dts({
            outDir: ['dist/cjs', 'dist/esm'],
            beforeWriteFile: (filePath, content) => {
                const isEsm = filePath.includes('esm')
                const replacedFilePath = isEsm ? filePath.replace('.d.ts', '.d.mts') : filePath

                return {filePath: replacedFilePath, content}
            },
        }),
    ],
})
