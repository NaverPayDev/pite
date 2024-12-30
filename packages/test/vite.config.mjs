import {createViteConfig} from '@naverpay/pite'

export const testInputMap = {
    index: './src/index',
    transpile: './src/utils/transpile',
    polyfill: './src/polyfill',
}

export const testEntryPath = './src/index'

// @ts-check
export default createViteConfig({
    formats: ['es', 'cjs'],
    cwd: '.',
    entry: testInputMap,
    allowedPolyfills: ['es.array.find-last'],
    options: {
        minify: false,
    },
})
