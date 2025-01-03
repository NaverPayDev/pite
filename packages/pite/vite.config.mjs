import builtins from 'builtins'

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
    outDir: ['dist/esm', 'dist/cjs'],
    entry: 'src/index',
    options: {
        rollupOptions: {
            external: [...deps, ...builtins()],
        },
        minify: false,
    },
})
