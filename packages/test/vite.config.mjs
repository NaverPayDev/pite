import {createViteConfig} from '@naverpay/pite'

// TODO : js, d.ts 간 디렉토리 문제 해결 필요
export const testInputMap = {
    index: './src/index',
    transpile: './src/utils/transpile',
    polyfill: './src/polyfill',
}

export const testEntryPath = './src/index'

// @ts-check
export default createViteConfig({
    formats: ['es', 'cjs'],
    entry: testEntryPath,
    options: {
        minify: false,
    },
})
