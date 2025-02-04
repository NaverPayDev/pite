export const replaceExtension = (target: string, replacement: '.mjs' | '.js') => {
    // .ts .jsx .tsx .scss
    const regex = /\.([tj]s[x]?|scss)$/
    return target.replace(regex, replacement)
}

export const getTypeExtension = (filePath: string, isEsm: boolean) =>
    isEsm ? filePath.replace('.d.ts', '.d.mts') : filePath.replace('.d.mts', '.d.ts')

export const isValidBrowserslistConfig = (input: unknown) => {
    if (!input) {
        return false
    }

    if (typeof input === 'string') {
        return true
    }

    if (typeof input === 'object') {
        return Object.keys(input).length > 0
    }

    return false
}
