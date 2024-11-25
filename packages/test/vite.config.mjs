import {resolve} from 'node:path'

import {createViteConfig} from '@naverpay/pite'

export default createViteConfig({
    formats: ['es', 'cjs'],
    input: {
        transpile: resolve(__dirname, 'src/utils/transpile'),
        polyfill: resolve(__dirname, 'src/polyfill'),
    },
    options: {
        minify: false,
    },
})
