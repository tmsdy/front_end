
const isObject = function (obj) {
    return Object.prototype.toString.call(null, obj) === '[object string]'
}

export {
    isObject
}