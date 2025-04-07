const sum = (...numbers: number[]) => {
    return numbers.reduce((acc, num) => acc + num, 0)
}

export default sum
