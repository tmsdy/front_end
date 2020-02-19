/*
SyncLoopHook：监听函数返回true则继续循环，返回false表示结束循环。
*/
let { SyncLoopHook } = require('tapable')

// 当触发此事件时候需要传入name参数，然后监听函数可以获取name参数
let queue = new SyncLoopHook(['name', 'age'])
queue.tap('1', function (name, age) {
    console.log(1, name, age)
    return false
})
queue.tap('2', function (name, age) {
    console.log(2, name, age)
    return false
})
queue.tap('3', function (name, age) {
    console.log(3, name, age)
})
queue.call('zfpx', 23) //