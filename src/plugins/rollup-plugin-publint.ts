/* eslint-disable no-console */
import {exec} from 'child_process'

const publint = () => {
    return {
        name: 'rollup-plugin-publint',
        buildStart() {
            exec(`npx @naverpay/publint`, (_, stdout, stderr) => {
                stdout && console.log('\x1b[34m%s\x1b[0m', '[publint]', stdout)
                stderr && console.log('\x1b[31m%s\x1b[0m', '[publint]', stderr)
            })
        },
    }
}

export default publint
