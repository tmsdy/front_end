class AsyncSeriesHook {
    constructor() {
        this.hooks = []
    }
    tapAsync(name, fn) {
        this.hooks.push(fn)
    }
    callAsync() {
        let args = [...arguments]
        let done = args.pop()
        let idx = 0
        let next = () => {
            let fn = this.hooks[idx++]
            fn ? fn(...args, next) : done()
        }
        next()
    }
}
let beforeRun = new AsyncSeriesHook(['compiler'])
console.time('cost')
beforeRun.tapAsync('1', (compilation, callback) => {
    setTimeout(() => {
        console.log(1, compilation)
        callback()
    }, 1000);
})
beforeRun.tapAsync('2', (compilation, callback) => {
    setTimeout(() => {
        console.log(2, compilation)
        callback()
    }, 2000);
})
beforeRun.tapAsync('3', (compilation, callback) => {
    setTimeout(() => {
        console.log(3, compilation)
        callback()
    }, 3000);
})
beforeRun.callAsync('compilation', () => {
    console.timeEnd('cost') // 6020ms
    console.log('完成了')
})
console.log('别的事情') // 因为是异步钩子，这里会先打印