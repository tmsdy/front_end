
console.log(process.env.NODE_ENV)

// 微任务
process.nextTick(function () { //急需执行的放这里
    console.log('nextTick')
})
console.log('111')

setImmediate(function () { //宏任务中最快的，不设时间用这个
    console.log('setImmediate')
})
setTimeout(function () { //设时间用这个
    console.log('setTimeout')
})
setTimeout(() => {
    // console.log(arguments) 闭包的五个参数 exports require module __filename __dirname
    console.log(arguments.length) //5
})
// ...放在形参是剩余运算符，将剩余的内容放到一个数组中，这里的args=['吃饭]
setTimeout((...args) => {
    console.log(args.length)
}, 100, '吃饭')
// 展开运算符
console.log([...[1, 2, 3], ...[4, 5, 6]]) //es6
console.log({ ...{ name: 'feifei' }, ...{ age: 22 } }) //es7