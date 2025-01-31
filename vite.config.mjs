import builtins from 'builtins'

import pkg from './package.json'
import {createViteConfig} from './src/index'

const deps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)].flatMap((dep) => [
    dep,
    new RegExp(`^${dep}/.*`),
])

// @ts-check
/**
 * 특정 entry에 대해서만 빌드가 필요하다면 './src/index.ts' 와 같이 확장자 명시해서 작성
 * 여러 entry가 필요하면 glob 패턴으로 작성해줘야함
 */
export default createViteConfig({
    cwd: __dirname,
    formats: ['es', 'cjs'],
    outDir: ['dist/esm', 'dist/cjs'],
    entry: ['./src/**/*.ts', '!./src/**/*.bench.ts', '!./src/**/*.test.ts'],
    ignoredPolyfills: ['esnext.json.parse'],
    options: {
        rollupOptions: {
            external: [...deps, ...builtins()],
        },
        minify: false,
    },
})
