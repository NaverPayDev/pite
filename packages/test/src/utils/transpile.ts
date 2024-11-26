export default function getNullishCoalescingOperator(a: string | null, b: string | null) {
    const result = a ?? b
    return result
}
