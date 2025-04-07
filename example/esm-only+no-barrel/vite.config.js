import {createViteConfig} from '@naverpay/pite'

export default createViteConfig({
    cwd: import.meta.dirname,
    entry: ['./src/**/*.ts'],
    outputs: [{format: 'es', dist: 'build-result'}],
    options: {
        minify: false,
    },
    publint: {
        severity: 'warn',
    },
})
