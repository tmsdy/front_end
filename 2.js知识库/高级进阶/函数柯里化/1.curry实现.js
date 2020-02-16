/*
1.柯里化行为规范
    1）逐步接收参数，并缓存供后期计算使用
    2）不立即计算，延后执行
    3）符合计算的条件，将缓存的参数，统一传递给执行方法

fn.length返回的是fn参数数量

*/

var fn = curry(function (a, b, c) {
    console.log([a, b, c], a + b + c);
})
let fn2 = curry((a, b) => {
    console.log(a, b)
})

fn(1, 2, 3) // [1, 2, 3] 6
fn(1, 2)(3) // [1, 2, 3] 6
fn(1)(2)(3) // [1, 2, 3] 6
fn(1)(2, 3) // [1, 2, 3] 6

function curry(fn) {
    return function judge(...args) {
        return args.length === fn.length
            ? fn(...args) // 满足条件才执行
            : (...arg) => judge(...args, ...arg)
    }
}




