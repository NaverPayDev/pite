import pkg from './package.json'
import {createViteConfig} from './src/index'

// @ts-check
export default createViteConfig({
    packageDir: __dirname,
    formats: ['es', 'cjs'],
    entry: 'src/index',
    options: {
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
    },
})
