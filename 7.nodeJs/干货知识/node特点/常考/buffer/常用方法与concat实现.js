/**常用方法 copy和concat重要*/
/*
buffer.fill(0) //全填0
buffer.slice(0, 2) //slice浅拷贝
*/
// copy拼接，不过太捞了
let buf1 = Buffer.from('hello')
let buf2 = Buffer.from('飞飞')
let buf = Buffer.allocUnsafe(15)
buf1.copy(buf, 0)
buf2.copy(buf, 5)
console.log(buf.toString()); //hello飞飞

let buf3 = Buffer.concat([buf1, buf2])
console.log(buf3.toString());

Buffer.Myconcat = function (list, totalLength) {
    // 1.判断长度是否传递，如果传递了用传的，没传就自己算一个总长度
    if (typeof totalLength === 'undefined') {
        totalLength = list.reduce((prev, next) => prev + next.length, 0)
    }
    // 2.通过长度创建一个这么大的buffer Buffer.alloc(len)
    let buffer = Buffer.alloc(totalLength)
    // 3.在循环list将每一项拷贝到这个大buffer上 buf.copy
    let offset = 0
    list.forEach(buff => {
        if (!Buffer.isBuffer(buff)) throw Error('not Buffer')
        buff.copy(buffer, offset)
        offset += buff.length
    })
    // 4.如果长度过长fill或者可以采用slice截取有效长度
    // 5.return 一个新buffer
    return buffer.slice(0, offset)
}
let buf4 = Buffer.from('hello')
let buf5 = Buffer.from('飞飞')

let buf6 = Buffer.Myconcat([buf4, buf5], 30)
console.log(buf6.toString());

