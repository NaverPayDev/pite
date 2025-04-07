const parseJson = <T extends object>(json: string): T | null => {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}

export default parseJson
