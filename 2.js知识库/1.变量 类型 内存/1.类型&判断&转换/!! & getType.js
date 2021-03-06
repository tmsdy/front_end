function getType(obj) {
    if (obj === null) return String(obj);
    return typeof obj === 'object'
        ? Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase()
        : typeof obj;
}
// 调用
console.log(getType(null)) // -> null
console.log(getType(undefined)) // -> undefined
console.log(getType({})) // -> object
console.log(getType([])) // -> array
console.log(getType(123)) // -> number
console.log(getType(true)) // -> boolean
console.log(getType('123')) // -> string
console.log(getType(/123/)) // -> regexp
console.log(getType(new Date())) // -> date

// 快速判断非空：!! 判断是不是null undifined 0 ''
console.log(!!{}) // true
console.log(!!null) // false
console.log(!!undefined) // false
console.log(!!0) // false
console.log(!!'') // false