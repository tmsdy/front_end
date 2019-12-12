const { Tapable, SyncHook } = require('tapable')

let t = new Tapable()
t.hooks = {
    myhook: new SyncHook()
}
let called = 0
t.hooks.myhook.tap('myhook', () => called++)
t.hooks.myhook.call()
console.log(called) // 1
t.hooks.myhook.tap('myhook', () => called += 10)
t.hooks.myhook.call()
console.log(called) // 12 两个事件都触发了