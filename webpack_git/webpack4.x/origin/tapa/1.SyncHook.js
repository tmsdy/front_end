let {SyncHook} = require('tapable')
// 当触发此事件时候需要传入name参数，然后监听函数可以获取name参数
let queue = new SyncHook(['name'])