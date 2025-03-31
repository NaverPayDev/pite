import {createViteConfig} from '@naverpay/pite'

export default createViteConfig({
    cwd: __dirname,
    cssFileName: 'index.css',
    entry: ['./src/**/*.@(ts|tsx)'],
    outputs: [
        {format: 'es', dist: 'build-result/esm'},
        {format: 'cjs', dist: 'build-result/cjs'},
    ],
    options: {
        minify: false,
    },
})
