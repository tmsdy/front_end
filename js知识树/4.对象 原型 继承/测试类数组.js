
let arr = {
    0: '000',
    1: '111',
    2: '222',
    length: 3
}

let a = [].shift.call(arr)

console.log(a) // 000
console.log(arr) // {0: '000',1: '111',length: 3}