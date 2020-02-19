/*
SyncWaterfallHook：前面的返回值给后面的函数用。
*/
let { SyncWaterfallHook } = require('tapable')

let queue = new SyncWaterfallHook(['name', 'age'])

queue.tap('1', function (name, age) {
    console.log(1, name, age) // 1 'zfpx' 23
    return 'error' // 返回值给后面的函数用。
})

queue.tap('2', function (name, age) {
    console.log(2, name, age) // 2 'error' 23
})

queue.tap('3', function (name, age) {
    console.log(3, name, age) // 3 'error' 23
})

queue.call('zfpx', 23) 