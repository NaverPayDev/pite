export default function getArrayAt(arr: string[], index: string) {
    const result = arr.findLast((elem) => elem === index)

    return result
}
