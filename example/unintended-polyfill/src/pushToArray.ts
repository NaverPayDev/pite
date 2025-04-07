const pushToArray = <T>(array: T[], item: T) => {
    const result = [...array]

    result.push(item)

    return result
}

export default pushToArray
