
// 获取类型：传入变量 返回变量的类型(小写的字符串)
export const getType = function (obj) {
    if (obj === null) return String(obj);
    return typeof obj === 'object'
        ? Object.prototype.toString.call(obj).replace('[object ', '').replace(']', '').toLowerCase()
        : typeof obj;
}

export const proxy = function (target, sourceKey, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get() {
            return this[sourceKey][key]
        },
        set(newVal) {
            this[sourceKey][key] = newVal
        }
    })
}