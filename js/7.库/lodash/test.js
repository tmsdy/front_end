function before(n, func) {
    let result
    if (typeof func != 'function') {
        throw new TypeError('Expected a function')
    }
    return function (...args) {
        if (--n > 0) {
            result = func.apply(this, args)
        }
        if (n <= 1) {
            func = undefined
        }
        return result
    }
}
function once(func) {
    return before(2, func)
}
let fn1 = () => {
    console.log(2222)
}
let fn2 = once(fn1)
fn2()
fn2()
fn2()