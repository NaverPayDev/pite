import {fileURLToPath} from 'node:url'

import {createViteConfig} from '@naverpay/pite'

const getPath = (path) => fileURLToPath(new URL(path, import.meta.url))

export default createViteConfig({
    formats: ['es', 'cjs'],
    input: {
        transpile: getPath('src/utils/transpile'),
        polyfill: getPath('src/polyfill'),
    },
    options: {
        minify: false,
    },
})
