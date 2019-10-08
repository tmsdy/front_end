Buffer.Myconcat = function (
    list,
    totalLength = list.reduce((prev, next) => prev + next.length, 0)
) {
    if (list.length == 1) {
        return list[0]
    }
    let buffer = Buffer.alloc(totalLength)
    let index = 0
    for (let buf of list) {
        for (let b of buf) {
            if (index >= totalLength) {
                return buffer
            } else {
                buffer[index++] = b
            }
        }
    }
    return buffer
}

let buf4 = Buffer.from('hello')
let buf5 = Buffer.from('飞飞')

let buf6 = Buffer.Myconcat([buf4, buf5], 6)
console.log(buf6.toString());