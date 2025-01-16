import {createViteConfig} from '@naverpay/pite'

export const testInputMap = {
    index: './src/index.ts',
    transpile: './src/utils/transpile.ts',
    polyfill: './src/polyfill.ts',
}

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
