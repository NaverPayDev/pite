import pkg from './package.json'
import {createViteConfig} from './src/index'

const deps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)].flatMap((dep) => [
    dep,
    new RegExp(`^${dep}/.*`),
])

// @ts-check
export default createViteConfig({
    cwd: __dirname,
    formats: ['es', 'cjs'],
    entry: 'src/index',
    options: {
        rollupOptions: {
            external: [...deps, 'node:path', 'node:fs'],
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
    },
})
