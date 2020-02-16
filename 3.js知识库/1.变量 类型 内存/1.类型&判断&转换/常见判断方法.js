let _toString = Object.prototype.toString

function isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

console.log(JSON.stringify({}) === '{}') //true