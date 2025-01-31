import path from 'path'

import {glob} from 'glob'

function isGlobPattern(input: string) {
    const globPattern = /[*?[\]{}]/
    return globPattern.test(input)
}

function getAllowGlob(globPatterns: string[]) {
    const allowPattern = globPatterns.filter((pattern) => !pattern.startsWith('!'))

    if (allowPattern.length === 0) {
        throw new Error('올바르지 못한 glob pattern 입니다')
    }
    return allowPattern
}

function getIgnoreGlob(globPatterns: string[]) {
    return globPatterns.filter((pattern) => pattern.startsWith('!')).map((pattern) => pattern.replace('!', ''))
}

function globToRecordSync(globPatterns: string[]) {
    const files = glob.sync(getAllowGlob(globPatterns), {ignore: getIgnoreGlob(globPatterns)})

    return files.reduce(
        (acc, file) => {
            const fileName = path.basename(file, path.extname(file))
            acc[fileName] = file
            return acc
        },
        {} as Record<string, string>,
    )
}

export function getViteEntry(input: string[]) {
    const isAllGlob = input.every((str) => isGlobPattern(str))

    // 입력 entry가 glob 패턴으로 들어온 경우
    if (isAllGlob) {
        const globPattern = input.find((pattern) => !pattern.startsWith('!'))

        // 모든 glob 패턴이 !로 시작하는 경우 예외 발생
        if (!globPattern) {
            throw new Error('올바르지 못한 glob pattern 입니다')
        }

        return globToRecordSync(input)
    }

    // 일반 경로와 glob 패턴이 섞여서 entry로 들어온 경우 에러 발생
    if (input.some((str) => isGlobPattern(str))) {
        throw new Error('entry 경로와 glob 패턴중 한가지만 사용해야합니다.')
    }

    // 일반 entry경로 입력시 그대로 사용
    return input
}
