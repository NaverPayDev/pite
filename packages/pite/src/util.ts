export const replaceExtension = (target: string, replacement: '.mjs' | '.js') => {
    // .ts .jsx .tsx
    const regex = /\.([tj]s[x]?)/
    return target.replace(regex, replacement)
}

export const getTypeExtension = (filePath: string, isEsm: boolean) =>
    isEsm ? filePath.replace('.d.ts', '.d.mts') : filePath.replace('.d.mts', '.d.ts')
