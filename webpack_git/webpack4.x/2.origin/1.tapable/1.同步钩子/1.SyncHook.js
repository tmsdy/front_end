/*
SyncHook：不关心返回值。
tap注册事件，call触发事件
*/
let { SyncHook } = require('tapable')

// 当触发此事件时候需要传入name和age参数，然后监听函数可以获取name和age参数
// let queue = new SyncHook(['name', 'age'])

// queue.tap('1', function (name, age) {
//     console.log(1, name, age)
//     return 'error' //不关心返回值
// })

// queue.tap('2', function (name, age) {
//     console.log(2, name, age)
// })

// queue.tap('3', function (name, age) {
//     console.log(3, name, age)
// })

// queue.call('zfpx', 23)

// console.log('别的事情') // 因为是同步钩子，这里会等事件全完成再打印

let queue = new SyncHook(['handleFile'])

queue.tap('1', function (file) {
    console.log('第一步处理: ', file)
})

queue.tap('2', function (file) {
    console.log('第二步处理: ', file)
})

queue.tap('3', function (file) {
    console.log('第三步处理: ', file)
})

queue.call('file内容') // 触发所有tap注册的事件

console.log('别的事情')