class SyncHook { //基本实现很简单，其他的hook都是加了一些扩展功能
    constructor() {
        this.hooks = []
    }

    tap(name, fn) {
        this.hooks.push(fn)
    }

    call() {
        this.hooks.forEach(hook => hook(...arguments))
    }

}
let queue = new SyncHook(['name', 'age'])
queue.tap('1', function (name, age) {
    console.log(1, name, age)
})
queue.tap('2', function (name, age) {
    console.log(2, name, age)
})
queue.tap('3', function (name, age) {
    console.log(3, name, age)
})
queue.call('zfpx', 23) //