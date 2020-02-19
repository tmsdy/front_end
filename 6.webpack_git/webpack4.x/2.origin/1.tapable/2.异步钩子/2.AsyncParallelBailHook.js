/*
AsyncParallelBailHook：异步并行执行，有一个失败了其他的就不走了，最终失败。
*/
let { AsyncParallelBailHook } = require('tapable')

let queue = new AsyncParallelBailHook(['name'])
console.time('cost')
queue.tapAsync('1', function (name, cb) { // 需要一个回调函数告知已完成
    setTimeout(() => {
        console.log(1, name)
        // cb()
    }, 1000);
})
queue.tapAsync('2', function (name, cb) {
    setTimeout(() => {
        console.log(2, name)
        cb()
    }, 2000);
})
queue.tapAsync('3', function (name, cb) {
    setTimeout(() => {
        console.log(3, name)
        cb()
    }, 3000);
})
queue.callAsync('hanfei', () => {
    console.log('over')
    console.timeEnd('cost') // 3003ms
})