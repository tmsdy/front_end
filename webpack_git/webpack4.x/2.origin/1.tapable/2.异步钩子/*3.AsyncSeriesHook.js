/*
AsyncSeriesHook: 异步串行执行
*/
let { AsyncSeriesHook } = require('tapable')
let beforeRun = new AsyncSeriesHook(['compiler'])
console.time('cost')
beforeRun.tapAsync('1', (compilation, callback) => {
    callback()
    setTimeout(() => {
        console.log(1, compilation)

    }, 1000)
})
beforeRun.tapAsync('2', (compilation, callback) => {
    setTimeout(() => {
        console.log(2, compilation)
        callback()
    }, 2000)
})
beforeRun.tapAsync('3', (compilation, callback) => {
    setTimeout(() => {
        console.log(3, compilation)
        callback()
    }, 3000)
})
beforeRun.callAsync('compilation', () => {
    console.timeEnd('cost') // 6020ms
    console.log('完成了')
})
console.log('别的事情') // 因为是异步钩子，这里会先打印