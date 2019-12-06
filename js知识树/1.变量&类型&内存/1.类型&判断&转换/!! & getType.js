function getType(obj) {
    if (obj === null) return String(obj);
    return typeof obj === 'object'
        ? Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase()
        : typeof obj;
}
// 调用
getType(null); // -> null
getType(undefined); // -> undefined
getType({}); // -> object
getType([]); // -> array
getType(123); // -> number
getType(true); // -> boolean
getType('123'); // -> string
getType(/123/); // -> regexp
getType(new Date()); // -> date

// 快速判断非空：!! 判断是不是null/undifined/0/''
console.log(!!{}) // true
console.log(!!null) // false
console.log(!!undefined) // false
console.log(!!0) // false
console.log(!!'') // false