import {createViteConfig} from '@naverpay/pite'

export default createViteConfig({
    cwd: __dirname,
    entry: ['./src/**/*.ts'],
    outputs: [{format: 'es', dist: 'build-result'}],
    options: {
        minify: false,
    },
    publint: {
        severity: 'warn',
    },
    skipRequiredPolyfillCheck: ['esnext.json.parse', 'es.array.push'],
})
