/*
SyncBailHook：有返回值则中断后续函数执行。
*/
let { SyncBailHook } = require('tapable')

let queue = new SyncBailHook(['name', 'age'])
queue.tap('1', function (name, age) {
    console.log(1, name, age)
    return 'error' // 后续的都不执行了。
})
queue.tap('2', function (name, age) {
    console.log(2, name, age)
})
queue.tap('3', function (name, age) {
    console.log(3, name, age)
})
queue.call('zfpx', 23) 