import {createViteConfig} from '@naverpay/pite'

export const testGlobArray = ['./src/**/*.ts', '!./src/**/*.bench.ts', '!./src/**/*.test.ts']

// @ts-check
export default createViteConfig({
    formats: ['es', 'cjs'],
    outDir: ['dist/esm', 'dist/cjs'],
    cwd: '.',
    entry: testGlobArray,
    allowedPolyfills: ['es.array.find-last'],
    options: {
        minify: false,
    },
})
