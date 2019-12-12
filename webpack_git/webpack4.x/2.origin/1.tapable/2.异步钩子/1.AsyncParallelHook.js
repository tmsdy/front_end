/*
AsyncParallelHook：异步并行执行，tapAsync注册的事件都走了callback才代表成功会走callAsync的成功回调函数，有一个失败了其他的还会走，最终失败。
*/
let { AsyncParallelHook } = require('tapable')

let queue = new AsyncParallelHook(['name'])
console.time('cost')
queue.tapAsync('1', function (name, cb) { // 需要一个回调函数告知已完成
    setTimeout(() => {
        console.log(1, name)
        cb()
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
// queue.call('hanfei') // 异步没有call这个方法
queue.callAsync('hanfei', () => {
    console.log('over')
    console.timeEnd('cost') // 3003ms
})
/* tapPromise的写法
queue.tapPromise('1', function (name) { // 需要一个回调函数告知已完成
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(1, name)
            resolve() //代表成功
        }, 1000);
    })
})
...
queue.promise('hanfei').then(()=>{
    console.log('over')
    console.timeEnd('cost') // 3003ms
})
*/