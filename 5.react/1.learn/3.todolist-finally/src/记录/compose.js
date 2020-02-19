function add1(str) {
    return str + 1
}
function add2(str) {
    return str + 2
}
function add3(str) {
    return str + 3
}

// let res = add3(add2(add1('feifei'))) // feifei123
// console.log(res)

let add = compose2(add3, add2, add1)
let res2 = add('feifei')
console.log(res2)

// 以前的写法
function compose(...fns) {
    return (...args) => {
        let last = fns.pop()
        return fns.reduceRight((prev, fn) => fn(prev), last(...args))
    }
}

// 最牛写法，效果就是搞成add3(add2(add1())),豁然开朗
function compose2(...fns) {
    // return fns.reduce((a, b) => (...args) => a(b(...args)))
    return fns.reduce((a, b) => {
        console.log(a, b)
        return (...args) => {
            return a(b(...args))
        }
    })
}